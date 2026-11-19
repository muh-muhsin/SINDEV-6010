import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { base } from "../__core/app";
import { auth, ownerEmail } from "../auth";
import { db } from "../database";
import { projects as table } from "../database/schema";
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
const owner = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session?.user.emailVerified || session.user.email.toLowerCase() !== ownerEmail)
    throw new ORPCError("UNAUTHORIZED");
  return next({ context });
});
const image = z.object({
  key: z.string().startsWith("projects/"),
  alt: z.string().min(1).max(200),
});
const input = z.object({
  id: z.string(),
  title: z.string().min(1).max(150),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1).max(5000),
  services: z.string().max(500),
  results: z.string().max(5000),
  images: z.array(image).max(12),
  published: z.boolean(),
});
async function hydrate(row: typeof table.$inferSelect) {
  const images = JSON.parse(row.images) as z.infer<typeof image>[];
  return {
    ...row,
    images: await Promise.all(
      images.map(async (i) => ({
        ...i,
        url: await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: i.key }),
          { expiresIn: 3600 },
        ),
      })),
    ),
  };
}
export const projects = {
  list: base.handler(async () =>
    Promise.all(
      (
        await db
          .select()
          .from(table)
          .where(eq(table.published, true))
          .orderBy(desc(table.updatedAt))
      ).map(hydrate),
    ),
  ),
  get: base.input(z.object({ slug: z.string() })).handler(async ({ input }) => {
    const row = (await db.select().from(table).where(eq(table.slug, input.slug)))[0];
    if (!row?.published) throw new ORPCError("NOT_FOUND");
    return hydrate(row);
  }),
  adminList: owner.handler(async () =>
    Promise.all((await db.select().from(table).orderBy(desc(table.updatedAt))).map(hydrate)),
  ),
  save: owner.input(input).handler(async ({ input }) => {
    const values = { ...input, images: JSON.stringify(input.images), updatedAt: Date.now() };
    await db.insert(table).values(values).onConflictDoUpdate({ target: table.id, set: values });
    return { ok: true };
  }),
  upload: owner
    .input(
      z.object({
        type: z.enum(["image/jpeg", "image/png", "image/webp"]),
        size: z
          .number()
          .positive()
          .max(8 * 1024 * 1024),
      }),
    )
    .handler(async ({ input }) => {
      const key = `projects/${crypto.randomUUID()}`;
      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          ContentType: input.type,
          ContentLength: input.size,
        }),
        { expiresIn: 600 },
      );
      return { key, url };
    }),
};
