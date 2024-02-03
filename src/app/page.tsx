"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Favourites from "./favourites";
import Search from "./search";
import Recents from "./recents";

export default function Home() {
  return (
    <div
      className="absolute inset-0 text-white"
      style={{
        backgroundImage: "url(/home-bg-640x422.jpeg)",
      }}
    >
      <div className="absolute inset-0  overflow-hidden bg-zinc-950/80 bg-[size:100%_100%] backdrop-blur-lg">
        <div className="absolute inset-0 mx-auto flex max-w-[640px] flex-col overflow-hidden">
          <div className="h-4"></div>
          <h1 className=" text-center text-[42px] font-bold">Heardlify</h1>
          <div className="h-3"></div>
          <p className="text-center text-lg font-light text-zinc-400">
            Look up any Spotify playlist and turn it into a guessing game
          </p>

          <div className="h-6"></div>
          <Tabs
            defaultValue="search"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex justify-center">
              <TabsList className="">
                <TabsTrigger value="search">search</TabsTrigger>
                <TabsTrigger value="favourites">favourites</TabsTrigger>
                <TabsTrigger value="recents">recents</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="search"
              className={`flex-1 flex-col overflow-hidden data-[state=active]:flex`}
            >
              <Search />
            </TabsContent>
            <TabsContent
              value="favourites"
              className="flex-1 flex-col overflow-hidden data-[state=active]:flex"
            >
              <Favourites />
            </TabsContent>
            <TabsContent
              value="recents"
              className="flex-1 flex-col overflow-hidden data-[state=active]:flex"
            >
              <Recents />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
