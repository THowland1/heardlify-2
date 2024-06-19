import latinize from "latinize";

export type Match = { substr: string; isMatchedPart: boolean };

function normalise(value: string): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return latinize(value.toLocaleLowerCase("en-GB"));
}

const PUNCTUATION_REGEXP = /[^\w\s]|_/g;
function removePunctuation(val: string): string {
  return val.replace(PUNCTUATION_REGEXP, "");
}

function normaliseQuery(val: string): string {
  return removePunctuation(normalise(val));
}

function mapShortenedIndexToOriginal(
  val: string,
  indexInShortened: number,
  startOrEnd: "start" | "end",
): number {
  const valWithPunctuationFlagged = val.replace(PUNCTUATION_REGEXP, "-");

  const map: number[] = [];
  let current = 0;
  for (const char of valWithPunctuationFlagged) {
    map.push(current);
    if (char !== "-") {
      current++;
    }
  }
  map.push(current);

  const index =
    startOrEnd === "start"
      ? map.lastIndexOf(indexInShortened)
      : map.indexOf(indexInShortened);
  return index;
}
export function getIsMatch(value: string, splitQuery: string[]): boolean {
  return splitQuery.every((query) => {
    const normalQuery = normaliseQuery(query);
    return (
      !!normalQuery && removePunctuation(normalise(value)).includes(normalQuery)
    );
  });
}

// TODO - rename variables - come up with clearer language around replacing and removing chars
export function getMatch(value: string, splitQuery: string[]): Match[] | null {
  const ranges: { start: number; end: number }[] = [];

  const normalValue = normalise(value);
  const valueWithoutPunctuation = removePunctuation(normalValue);
  const mapIndex = (ind: number, startOrEnd: "start" | "end") =>
    mapShortenedIndexToOriginal(normalValue, ind, startOrEnd);
  for (const query of splitQuery) {
    let searchStartIndex = 0;
    const normalQuery = normaliseQuery(query);

    while (true) {
      const startIndex = valueWithoutPunctuation.indexOf(
        normalQuery,
        searchStartIndex,
      );

      if (startIndex < 0) {
        break;
      }

      const endIndex = startIndex + normalQuery.length;
      ranges.push({
        start: mapIndex(startIndex, "start"),
        end: mapIndex(endIndex, "end"),
      });
      searchStartIndex = endIndex;
    }
  }

  const matches: Match[] = [];
  let currentMatch: Match = { substr: "", isMatchedPart: false };
  for (let i = 0; i < value.length; i++) {
    const char = value[i]!;
    const isMatchedChar = ranges.some((r) => r.start <= i && r.end > i);
    if (currentMatch.isMatchedPart === isMatchedChar) {
      currentMatch.substr = currentMatch.substr.concat(char);
    } else {
      matches.push(currentMatch);
      currentMatch = {
        substr: char,
        isMatchedPart: isMatchedChar,
      };
    }
  }
  matches.push(currentMatch);

  return matches;
}
