import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStorageQuery<TType extends object>({
  serialise,
  defaultValue,
  deserialise,
  queryKey,
  storage,
}: StorageQueryConfig<TType>) {
  return useQuery({
    queryKey: queryKey,
    initialData: defaultValue,
    queryFn: () => {
      const storageKey = toStorageKey(queryKey);
      const serialised = window[storage].getItem(storageKey);
      if (serialised) {
        try {
          return deserialise(serialised);
        } catch (error) {
          console.error(
            `Value exists, but could not deserialise. Falling back to default.`,
          );
        }
      }
      window[storage].setItem(storageKey, serialise(defaultValue));
      return defaultValue;
    },
  });
}

export function useStorageMutation<TType extends object>(
  config: StorageQueryConfig<TType>,
) {
  const queryClient = useQueryClient();
  const currentValue = useStorageQuery(config).data;

  const { serialise, queryKey, storage } = config;

  return useMutation({
    mutationFn: async (updater: TType | ((current: TType) => TType)) => {
      const val =
        typeof updater === "function" ? updater(currentValue) : updater;
      const serialised = serialise(val);
      const storageKey = toStorageKey(queryKey);

      window[storage].setItem(storageKey, serialised);
      queryClient.setQueryData(queryKey, val);
    },
  });
}

export type StorageQueryConfig<TType extends object> = {
  serialise: (val: TType) => string;
  deserialise: (val: string) => TType;
  /** Will be used as the react-query key (as is) and the storage key (stringified and colon-separated) */
  queryKey: unknown[];
  defaultValue: TType;
  storage: "sessionStorage" | "localStorage";
};

function toStorageKey(key: unknown[]) {
  return key.map(String).join(":");
}
