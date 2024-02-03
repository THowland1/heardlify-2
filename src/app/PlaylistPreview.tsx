"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  type Favourite,
  useFavouritesMutation,
  useFavouritesQuery,
} from "~/lib/storage/favourites";

export function PlaylistPreview({
  playlist,
}: {
  playlist: SpotifyApi.PlaylistObjectSimplified | Favourite;
}) {
  const favouritesQuery = useFavouritesQuery();
  const favourites = favouritesQuery.data ?? [];
  const favouritesMutation = useFavouritesMutation();
  const isFavourite = favourites.some((f) => f.id === playlist.id);
  return (
    <Link
      className="relative mb-3 flex cursor-pointer overflow-hidden  rounded-lg bg-zinc-800 hover:bg-zinc-700"
      href={`/${encodeURIComponent(playlist.name).replace(/%../g, "+")}-${playlist.id}`}
    >
      <div className="h-20 w-20">
        {playlist.images[0]?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={playlist.images[0]?.url}
            alt={`${playlist.name} cover art`}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col  overflow-hidden p-2.5 text-sm">
        <div>{playlist.name}</div>
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-zinc-400">
          {playlist.description}
        </div>
        <div className="text-zinc-400">
          By {playlist.owner.display_name ?? "unknown"}
        </div>
      </div>
      <div className="absolute bottom-1 right-1 text-zinc-500">
        {isFavourite ? (
          <Star
            className="h-5 w-5 fill-current"
            onClick={async () => {
              await favouritesMutation.mutateAsync((faves) =>
                faves.filter((f) => f.id !== playlist.id),
              );
            }}
          />
        ) : (
          <Star
            className="h-5 w-5"
            onClick={async () => {
              await favouritesMutation.mutateAsync((faves) => {
                faves.push(playlist);
                return faves;
              });
            }}
          />
        )}
      </div>
    </Link>
  );
}
export function PlaylistPreviewEmpty({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        `mt-3 flex overflow-hidden rounded-lg  bg-zinc-800`,
        className,
      )}
    >
      <div className="h-20 w-20">
        <div className="h-full w-full bg-zinc-700" />
      </div>
      <div className="flex flex-1 flex-col  justify-between overflow-hidden p-2.5 text-sm">
        <div className="h-3 w-32 rounded-full bg-zinc-700" />
        <div className="h-3 w-64 rounded-full bg-zinc-700" />
        <div className="h-3 w-28 rounded-full bg-zinc-700" />
      </div>
    </div>
  );
}
export function PlaylistPreviewSkeleton() {
  return (
    <div className="mt-3 flex overflow-hidden rounded-lg  bg-zinc-800">
      <div className="h-20 w-20">
        <Skeleton className="h-full w-full bg-zinc-700" />
      </div>
      <div className="flex flex-1 flex-col  justify-between overflow-hidden p-2.5 text-sm">
        <Skeleton className="h-3 w-32 rounded-full bg-zinc-700" />
        <Skeleton className="h-3 w-64 rounded-full bg-zinc-700" />
        <Skeleton className="h-3 w-28 rounded-full bg-zinc-700" />
      </div>
    </div>
  );
}
