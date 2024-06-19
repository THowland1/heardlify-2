import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import type { IDetailedOption } from "~/server/api/routers/playlist";
import { getIsMatch, getMatch } from "./getMatch";

const MAX_PAGE_SIZE = 6;

type Match = { substr: string; isMatchedPart: boolean };

function filterAndPage(
  options: IDetailedOption[] | null,
  query: string,
): {
  totalCount: number;
  pagedCount: number;
  pagedValues: Match[][];
  query: string;
} | null {
  if (!options) return null;
  const splitQuery = query.split(" ").filter((o) => !!o);
  let totalCount = 0;
  const pagedValues: Match[][] = [];
  for (const option of options) {
    const isMatch = getIsMatch(option.formatted, splitQuery);
    if (isMatch) {
      totalCount++;
      if (pagedValues.length < MAX_PAGE_SIZE) {
        const match = getMatch(option.formatted, splitQuery);
        if (match) {
          // TODO - log something if the user managed to get here
          pagedValues.push(match);
        }
      }
    }
  }

  return {
    pagedCount: pagedValues.length,
    pagedValues,
    totalCount,
    query,
  };
}

export function AutoComplete(props: { options: IDetailedOption[] | null }) {
  const [focus, setFocus] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const result = filterAndPage(props.options, searchValue);

  return (
    <Popover.Root open={focus}>
      <Popover.Anchor asChild>
        <div className="relative [--h:50px]">
          <input
            placeholder="Know it? Search for the artist / title"
            className="h-[--h] w-full border border-zinc-500 bg-transparent px-[--h] py-2 text-white outline-none focus-visible:border-t-0 focus-visible:border-green-700"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
          />
          <div className="absolute bottom-0 left-0 top-0 grid size-[--h] place-items-center">
            <HourglassIcon className="size-5 text-base leading-none text-zinc-500" />
          </div>
          <div className="absolute bottom-0 right-0 top-0 grid size-[--h] place-items-center">
            <button
              onClick={() => alert(123)}
              className="rounded border border-transparent outline-none focus-visible:border-green-700"
            >
              <XIcon className="size-5 text-base leading-none text-zinc-100" />
            </button>
          </div>
        </div>
      </Popover.Anchor>
      <Popover.Content
        side="top"
        className="w-screen max-w-2xl border border-b-0 border-green-700 bg-zinc-900"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {result && (
          <>
            {result.pagedValues.map((o, i) => (
              <div
                key={result.query + "___" + i}
                className="border-b border-b-zinc-500 px-2 py-2 text-sm text-white"
              >
                {o.map((oo, ii) => (
                  <span
                    key={ii}
                    data-match={oo.isMatchedPart}
                    className="data-[match=true]:bg-zinc-600"
                  >
                    {oo.substr}
                  </span>
                ))}
              </div>
            ))}
            {result.totalCount ? (
              <div className="p-2 text-xs text-zinc-400">
                {result.pagedCount} of {result.totalCount} for &quot;
                {result.query}
                &quot;
              </div>
            ) : (
              <div className="p-2 text-xs text-zinc-400">
                No results for &quot;{result.query}&quot;. Maybe it&apos;s
                something else...
              </div>
            )}
          </>
        )}
        {!result && (
          // TODO - add juice
          <div className="p-2 text-xs text-zinc-400">Loading options...</div>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}

function HourglassIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
