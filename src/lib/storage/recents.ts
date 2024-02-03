import { z } from "zod";
import {
  type StorageQueryConfig,
  useStorageMutation,
  useStorageQuery,
} from "../react-storage-query";

export type Recent = {
  id: string;
  images: { url: string }[];
  name: string;
  description: string | null;
  lastPlayedIsoDate: string;
  owner: {
    display_name?: string;
  };
};
export const Recent: z.ZodType<Recent> = z.object({
  id: z.string(),
  images: z.object({ url: z.string() }).array(),
  name: z.string(),
  description: z.string().nullable(),
  lastPlayedIsoDate: z.string(),
  owner: z.object({
    display_name: z.string().optional(),
  }),
});

const config: StorageQueryConfig<Recent[]> = {
  defaultValue: [],
  queryKey: ["recents"],
  serialise: (val) => JSON.stringify(val),
  deserialise: (val) => Recent.array().parse(JSON.parse(val)),
  storage: "localStorage",
};
export function useRecentsQuery() {
  return useStorageQuery(config);
}
export function useFRecentMutation() {
  return useStorageMutation(config);
}
