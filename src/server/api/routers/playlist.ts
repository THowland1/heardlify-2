import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import spotifyAuth from "~/server/spotify/auth";

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
});
