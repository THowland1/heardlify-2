"use client";

import { useFavouritesQuery } from "~/lib/storage/favourites";
import { PlaylistPreview, PlaylistPreviewEmpty } from "./PlaylistPreview";

export default function Favourites() {
  const favouritesQuery = useFavouritesQuery();
  const favourites = favouritesQuery?.data;
  if (!favourites) return null;

  return (
    <>
      <div className="mt-3 overflow-y-auto">
        {favourites.map((playlist) => (
          <PlaylistPreview key={playlist.id} playlist={playlist} />
        ))}
        {favourites.length === 0 && (
          <div>
            <div className="rounded bg-zinc-800 p-[2px] text-center text-sm font-medium">
              Your favourites will go here
            </div>
            <PlaylistPreviewEmpty className="opacity-90" />
            <PlaylistPreviewEmpty className="opacity-60" />
            <PlaylistPreviewEmpty className="opacity-30" />
            <PlaylistPreviewEmpty className="opacity-10" />
          </div>
        )}
      </div>
    </>
  );
}
