import { z } from "zod";
import {
  type StorageQueryConfig,
  useStorageMutation,
  useStorageQuery,
} from "../react-storage-query";

type Guess =
  | {
      type: "skipped";
    }
  | {
      type: "empty";
    }
  | {
      type: "guessed";
      artists: string;
      name: string;
      isCorrectArtist: boolean;
      isCorrectSong: boolean;
    };
const Guess: z.ZodType<Guess> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("skipped") }),
  z.object({ type: z.literal("empty") }),
  z.object({
    type: z.literal("guessed"),
    artists: z.string(),
    name: z.string(),
    isCorrectArtist: z.boolean(),
    isCorrectSong: z.boolean(),
  }),
]);

type Stage = {
  duration: number;
  message: string;
  guess: Guess;
};
const Stage: z.ZodType<Stage> = z.object({
  duration: z.number(),
  message: z.string(),
  guess: Guess,
});

type Game = {
  playlistId: string;
  epochDay: number;
  stages: Stage[];
};
const Game: z.ZodType<Game> = z.object({
  playlistId: z.string(),
  epochDay: z.number(),
  stages: Stage.array(),
});

function getTodaysGuessesDefault(): Stage[] {
  return [
    {
      duration: 1,
      message: "A VIRTUOSO PERFORMANCE!",
      guess: { type: "empty" },
    },
    { duration: 2, message: "AN ACT OF GENIUS!", guess: { type: "empty" } },
    { duration: 4, message: "YOU'RE A STAR!", guess: { type: "empty" } },
    { duration: 7, message: "WHAT A PRO!", guess: { type: "empty" } },
    { duration: 11, message: "YOU'RE A WINNER!", guess: { type: "empty" } },
    { duration: 16, message: "GOOD RESULT!", guess: { type: "empty" } },
  ];
}

type Props = { playlistId: string; epochDay: number };
function config({ playlistId, epochDay }: Props): StorageQueryConfig<Game> {
  return {
    defaultValue: { playlistId, epochDay, stages: getTodaysGuessesDefault() },
    queryKey: ["game", playlistId, epochDay],
    serialise: (val) => JSON.stringify(val),
    deserialise: (val) => Game.parse(JSON.parse(val)),
    storage: "localStorage",
  };
}
export function useGameQuery(props: Props) {
  return useStorageQuery(config(props));
}
export function useGameMutation(props: Props) {
  return useStorageMutation(config(props));
}
