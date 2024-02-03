import { z } from "zod";
import {
  type StorageQueryConfig,
  useStorageMutation,
  useStorageQuery,
} from "../react-storage-query";

export type Favourite = {
  id: string;
  images: { url: string }[];
  name: string;
  description: string | null;
  owner: {
    display_name?: string;
  };
};
export const Favourite: z.ZodType<Favourite> = z.object({
  id: z.string(),
  images: z.object({ url: z.string() }).array(),
  name: z.string(),
  description: z.string().nullable(),
  owner: z.object({
    display_name: z.string().optional(),
  }),
});

const config: StorageQueryConfig<Favourite[]> = {
  defaultValue: [],
  queryKey: ["favourites"],
  serialise: (val) => JSON.stringify(val),
  deserialise: (val) => Favourite.array().parse(JSON.parse(val)),
  storage: "localStorage",
};
export function useFavouritesQuery() {
  return useStorageQuery(config);
}
export function useFavouritesMutation() {
  return useStorageMutation(config);
}
