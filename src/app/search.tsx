"use client";

import { Search as SearchIcon } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/react";
import { PlaylistPreview, PlaylistPreviewSkeleton } from "./PlaylistPreview";

export default function Search() {
  const [q, setQ] = useState("All Out");
  const playlistsQuery = api.playlist.search.useInfiniteQuery(
    {
      q,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
      refetchOnWindowFocus: false,
      enabled: !!q,
    },
  );
  const pages = playlistsQuery.data?.pages ?? [];

  const scrollEl = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollEl.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollEl.current;
    if (scrollTop + clientHeight === scrollHeight) {
      if (playlistsQuery.hasNextPage && !playlistsQuery.isFetchingNextPage)
        void playlistsQuery.fetchNextPage();
    } else {
    }
  }, [scrollEl, playlistsQuery]);

  useEffect(() => {
    if (scrollEl.current) {
      const current = scrollEl.current;
      current.addEventListener("scroll", handleScroll);
      return () => current?.removeEventListener("scroll", handleScroll);
    }
  }, [scrollEl, handleScroll]);

  return (
    <>
      <div className="relative">
        <SearchIcon className="absolute bottom-0 left-3 top-0 my-auto h-4 w-4 text-zinc-500" />
        <Input
          className="h-10 px-10"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
        />
      </div>
      <div className="mt-3 overflow-y-auto" ref={scrollEl}>
        {!q && (
          <div className="text-center text-base text-zinc-400">
            Start typing to find a Spotify playlist to Heardlify
          </div>
        )}
        {pages.map((page) => (
          <Fragment key={`${page.input.q}:${page.input.cursor}`}>
            {page.playlists.items.map((playlist) => (
              <PlaylistPreview key={playlist.id} playlist={playlist} />
            ))}
          </Fragment>
        ))}
        {playlistsQuery.isFetchingNextPage ||
          (playlistsQuery.isLoading && q && (
            <>
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
              <PlaylistPreviewSkeleton />
            </>
          ))}
      </div>
    </>
  );
}
