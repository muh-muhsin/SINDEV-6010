import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export function useProjects() {
  return useQuery(orpc.projects.list.queryOptions());
}
export function useProject(slug: string) {
  return useQuery(orpc.projects.get.queryOptions({ input: { slug } }));
}
export function useAdminProjects() {
  return useQuery(orpc.projects.adminList.queryOptions({ retry: false }));
}
export function useSaveProject() {
  const q = useQueryClient();
  return useMutation(
    orpc.projects.save.mutationOptions({
      onSuccess: () => q.invalidateQueries({ queryKey: orpc.projects.key() }),
    }),
  );
}
export function useUpload() {
  return useMutation(orpc.projects.upload.mutationOptions());
}
