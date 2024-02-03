"use client";

import { useRecentsQuery } from "~/lib/storage/recents";
import { PlaylistPreview, PlaylistPreviewEmpty } from "./PlaylistPreview";

export default function Recents() {
  const recentsQuery = useRecentsQuery();
  const recents = recentsQuery?.data;
  if (!recents) return null;

  return (
    <>
      <div className="mt-3 overflow-y-auto">
        {recents.map((playlist) => (
          <PlaylistPreview key={playlist.id} playlist={playlist} />
        ))}
        {recents.length === 0 && (
          <div>
            <div className="rounded bg-zinc-800 p-[2px] text-center text-sm font-medium">
              Your recents will go here
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
