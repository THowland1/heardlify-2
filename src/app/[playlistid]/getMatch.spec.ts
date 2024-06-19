import { expect, test } from "vitest";
import { type Match, getMatch } from "./getMatch";

test.each<{ value: string; query: string; expected: Match[] }>([
  {
    value: "Bobby Darin - Splish Splash",
    query: "spl",
    expected: [
      { substr: "Bobby Darin - ", isMatchedPart: false },
      { substr: "Spl", isMatchedPart: true },
      { substr: "ish ", isMatchedPart: false },
      { substr: "Spl", isMatchedPart: true },
      { substr: "ash", isMatchedPart: false },
    ],
  },
  {
    value: "Bobby Darin - Špłish Śplash",
    query: "spŁ",
    expected: [
      { substr: "Bobby Darin - ", isMatchedPart: false },
      { substr: "Špł", isMatchedPart: true },
      { substr: "ish ", isMatchedPart: false },
      { substr: "Śpl", isMatchedPart: true },
      { substr: "ash", isMatchedPart: false },
    ],
  },
  {
    value: "Bobby Darin - Špłish Śplash",
    query: "sp'Ł",
    expected: [
      { substr: "Bobby Darin - ", isMatchedPart: false },
      { substr: "Špł", isMatchedPart: true },
      { substr: "ish ", isMatchedPart: false },
      { substr: "Śpl", isMatchedPart: true },
      { substr: "ash", isMatchedPart: false },
    ],
  },
  {
    value: "The Lightning Seeds - Football's Coming Home",
    query: "footballs",
    expected: [
      { substr: "The Lightning Seeds - ", isMatchedPart: false },
      { substr: "Football's", isMatchedPart: true },
      { substr: " Coming Home", isMatchedPart: false },
    ],
  },
  {
    value: "Barrett Strong - Money (That's What I Want)",
    query: "thats",
    expected: [
      { substr: "Barrett Strong - Money (", isMatchedPart: false },
      { substr: "That's", isMatchedPart: true },
      { substr: " What I Want)", isMatchedPart: false },
    ],
  },
  {
    value: "Peggy Lee - Fever",
    query: "fever",
    expected: [
      { substr: "Peggy Lee - ", isMatchedPart: false },
      { substr: "Fever", isMatchedPart: true },
    ],
  },
])("highlighting $value with $query", ({ value, query, expected }) => {
  expect(getMatch(value, query.split(" "))).toMatchObject(expected);
});
