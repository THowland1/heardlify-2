import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import spotifyAuth from "~/server/spotify/auth";
import { seededShuffle } from "./lib/seeded-shuffle";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}
type WithRequired<T, K extends keyof T> = T & { [P in K]: NonNullable<T[P]> };
function propertyIsNotNull<T, TPropKey extends keyof T>(propKey: TPropKey) {
  return function (value: T): value is WithRequired<T, TPropKey> {
    return value[propKey] !== null && value[propKey] !== undefined;
  };
}

export type IOption = {
  artists: {
    list: {
      id: string;
      name: string;
    }[];
    formatted: string;
  };
  formatted: string;
  name: string;
  id: string;
};
export type IDetailedOption = IOption & {
  imgSrc: string | null;
  year: number;
  previewUrl: string;
};

function isoDateStringToEpochDay(date: string): number {
  let dateValue = Date.parse(date);
  if (isNaN(dateValue)) {
    dateValue = new Date().valueOf();
  }
  return Math.floor(dateValue / DAY_IN_MS);
}
async function getOne(
  playlistId: string,
  bearerToken: string,
): Promise<SpotifyApi.PlaylistObjectFull> {
  const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}`);
  const headers: HeadersInit = {
    Authorization: `Bearer ${bearerToken}`,
  };
  const response = await fetch(url.toString(), { headers });
  const data = (await response.json()) as SpotifyApi.PlaylistObjectFull;
  return data;
}
async function searchPlaylists(
  bearerToken: string,
  q: string,
  offset = 0,
  limit = 10,
): Promise<SpotifyApi.PlaylistSearchResponse> {
  const url = new URL(`https://api.spotify.com/v1/search`);
  url.searchParams.append("q", q);
  url.searchParams.append("type", "playlist");
  url.searchParams.append("offset", String(offset));
  url.searchParams.append("limit", String(limit));
  const headers: HeadersInit = {
    Authorization: `Bearer ${bearerToken}`,
  };
  const response = await fetch(url.toString(), { headers });
  const data = response.json() as Promise<SpotifyApi.PlaylistSearchResponse>;

  return data;
}
const MAX_SPOTIFY_API_PAGING_LIMIT = 100;

async function getTracksPaged(
  playlistId: string,
  bearerToken: string,
  offset: number,
  limit: number,
): Promise<SpotifyApi.PlaylistTrackResponse> {
  const url = new URL(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  );
  url.searchParams.append("offset", String(offset));
  url.searchParams.append("limit", String(limit));
  const headers: HeadersInit = {
    Authorization: `Bearer ${bearerToken}`,
  };

  const response = await fetch(url.toString(), { headers });
  const data = (await response.json()) as SpotifyApi.PlaylistTrackResponse;
  return data;
}

async function getAllTracksExpensively(
  playlistId: string,
  accessToken: string,
): Promise<IDetailedOption[]> {
  const options: IDetailedOption[] = [];

  let offset = 0;
  const limit = MAX_SPOTIFY_API_PAGING_LIMIT;
  let total: number;
  do {
    const page = await getTracksPaged(playlistId, accessToken, offset, limit);
    total = page.total;

    const pageAsOptions = page.items
      .map((i) => i.track)
      .filter(isNotNull)
      .filter(propertyIsNotNull("preview_url"))
      .filter((t) => t.type === "track")
      .map((i) => mapTrackToDetailedOption(i));
    options.push(...pageAsOptions);
    offset += limit;
  } while (offset < total);
  return options;
}

function mapTrackToDetailedOption(
  track: WithRequired<SpotifyApi.TrackObjectFull, "preview_url">,
): IDetailedOption {
  const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
  const formattedArtists = artists.map((a) => a.name).join(", ");

  return {
    artists: {
      list: artists,
      formatted: formattedArtists,
    },
    formatted: `${formattedArtists} - ${track.name}`,
    id: track.id,
    imgSrc: track.album.images[track.album.images.length - 1]?.url ?? null,
    name: track.name,
    year: Number(track.album.release_date.split("-")[0]),
    previewUrl: track.preview_url,
  };
}
export const playlistRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ q: z.string(), cursor: z.number(), limit: z.number() }))
    .query(async ({ input }) => {
      const authToken = await spotifyAuth.getClientCredentialsToken();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { playlists } = await searchPlaylists(
        authToken.access_token,
        input.q,
        input.cursor,
        input.limit,
      );
      console.log(playlists);
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        playlists,
        input,
        nextCursor: playlists.next ? input.cursor + 10 : undefined,
      };
    }),
  getSong: publicProcedure
    .input(z.object({ playlistId: z.string(), dateIsoString: z.string() }))
    .query(async ({ input }) => {
      const refresh_token = env.SPOTIFY_REFRESH_TOKEN;
      console.log({ refresh_token });
      const token = await spotifyAuth.getRefreshTokenToken({ refresh_token });
      const allPlaylistTracks = await getAllTracksExpensively(
        input.playlistId,
        token.access_token,
      );
      const playlist = await getOne(input.playlistId, token.access_token);
      const totalCount = allPlaylistTracks.length;

      const fullDaysSinceEpoch = isoDateStringToEpochDay(input.dateIsoString);
      const index = fullDaysSinceEpoch % totalCount;
      const answer = seededShuffle(allPlaylistTracks, input.playlistId)[index];

      const result = {
        answer,
        options: allPlaylistTracks,
        playlist: {
          name: playlist.name,
          imageUrl: playlist.images[playlist.images.length - 1]?.url,
        },
      };

      return result;
    }),
});
