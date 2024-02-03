"use client";

import { NextPage } from "next";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EpochDay } from "~/lib/epoch-day";
import { useGameMutation, useGameQuery } from "~/lib/storage/game";
import { api } from "~/trpc/react";

function isSpotifyId(value: string) {
  const spotifyIdRegexp = new RegExp(
    "^[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{22}$",
  );
  return spotifyIdRegexp.test(value);
}

function getDateFromURL(dateString: string) {
  if (!dateString) return new Date();
  const dateValue = Date.parse(dateString);
  return isNaN(dateValue) ? new Date() : new Date(dateValue);
}

export default function PlaylistPage({
  params,
  searchParams,
}: {
  params: { playlistid: string };
  searchParams: Record<"date" | "time-machine", string | string[] | undefined>;
}) {
  const queryDate = getDateFromURL(
    typeof searchParams.date === "string" ? searchParams.date : "",
  );
  const timeMachine = typeof searchParams["time-machine"] === "string";
  const slug = params.playlistid ?? "";
  const slugSplit = slug.split("-");
  const playlistId =
    slugSplit[slugSplit.length - 1] ?? "0erQqpBCFFYj0gDam2pnp1";
  if (!isSpotifyId(playlistId)) {
    throw new Error("The given id is not a playlist id");
  }
  const localdate = queryDate ?? new Date();
  const epochDay = EpochDay.fromDate(localdate);

  const playlistQuery = api.playlist.getSong.useQuery(
    {
      playlistId,
      dateIsoString: localdate.toISOString().split("T")[0]!,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      staleTime: 60 * 60 * 1000,
    },
  );
  const playlist = playlistQuery.data;
  const gameQuery = useGameQuery({ playlistId, epochDay });
  const gameMutation = useGameMutation({ playlistId, epochDay });
  const stages = gameQuery.data.stages;

  const [focus, setFocus] = useState(true);

  return (
    <div
      className="absolute inset-0 text-white"
      style={{
        backgroundImage: `url(${
          playlist?.playlist.imageUrl ?? "/home-bg-640x422.jpeg"
        })`,
        backgroundSize: "100% 100%",

        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0  overflow-hidden bg-zinc-950/80 bg-[size:100%_100%] backdrop-blur-2xl">
        <div className="absolute inset-0 mx-auto flex max-w-[640px] flex-col overflow-hidden">
          {playlist && (
            <>
              <div>
                {stages.map((stage, i) => (
                  <div key={i}>{JSON.stringify(stage, null, 2)}</div>
                ))}
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Popover open={focus}>
                <PopoverContent
                  className="w-[640px]"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  Place content for the popover here.
                </PopoverContent>
              </Popover>
              <div>
                <PopoverTrigger>
                  <Input
                    onFocus={() => {
                      setFocus(true);
                    }}
                    onBlur={() => {
                      setFocus(false);
                    }}
                  />
                </PopoverTrigger>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
