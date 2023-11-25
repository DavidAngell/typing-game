import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { useCallback, useState, useRef } from 'react'
import { set } from "zod";
import { Game, paragraphTypeFromStr } from "@/components/Game";
import { ParagraphType } from "@/components/Game";
import type { CustomFlowbiteTheme } from 'flowbite-react';
import { Dropdown, Flowbite } from 'flowbite-react';
import KeyboardIcon from "@/components/KeyboardIcon";

export default function Home() {
  const [paragraphType, setParagraphType] = useState(ParagraphType.WORDS_20);
  const [dropdownLabel, setDropdownLabel] = useState("20 Words");
  const [inputValue, setInputValue] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <Flowbite theme={{ theme: customTheme }}>
        <Head>
          <title>Simple Typing Game</title>
          <meta name="description" content="David's boring typing game" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <input 
          className="absolute opacity-0 w-full h-full top-0 left-0 z-10" 
          // autoFocus={true} 
          type="text" 
          value={inputValue} 
          onChange={(e) => { setInputValue(e.target.value); }}
          onFocus={() => { setInputFocus(true); }}
          onBlur={() => { setInputFocus(false); }}
          />
        <main className="flex min-h-screen flex-col items-center bg-main-800 font-sans relative">
          <div className="container flex flex-col items-center gap-10 px-4 py-16">
            <div>
              <div className="flex flex-row justify-center items-center gap-6">
                <KeyboardIcon />
                <h1 className="text-5xl text-main-100 font-bold">Simple Typing Game</h1>
              </div>
              <hr className="h-1 bg-main-400 border-0 rounded-full"/>
            </div>
            <div className="z-30">
              <Dropdown label={dropdownLabel} size="xl">
                <Dropdown.Item onClick={() => { setParagraphType(ParagraphType.WORDS_20); setDropdownLabel("20 Words"); }}>20 Words</Dropdown.Item>
                <Dropdown.Item onClick={() => { setParagraphType(ParagraphType.WORDS_50); setDropdownLabel("50 Words"); }}>50 Words</Dropdown.Item>
                <Dropdown.Item onClick={() => { setParagraphType(ParagraphType.WORDS_100); setDropdownLabel("100 Words"); }}>100 Words</Dropdown.Item>
                <Dropdown.Item onClick={() => { setParagraphType(ParagraphType.WORDS_200); setDropdownLabel("200 Words"); }}>200 Words</Dropdown.Item>
                <Dropdown.Item onClick={() => { setParagraphType(ParagraphType.Quote); setDropdownLabel("Quote") }}>Quote</Dropdown.Item>
              </Dropdown>
            </div>
            <Game paragraphType={paragraphType} inputText={inputValue} inputSetter={setInputValue} inputFocus={inputFocus} />
          </div>
        </main>
      </Flowbite>
    </>
  );
}

const customTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: 'bg-main-500 text-main-100 hover:bg-main-600 border border-main-300 transition-colors',
    },
  },
  spinner: {
    color: {
      primary: 'text-main-200 animate-spin fill-main-600',
    },
  },
  dropdown: {
    "arrowIcon": "ml-1",
    "floating": {
      "animation": "transition-opacity",
      "content": "py-1 px-1 text-sm text-main-100 bg",
      "divider": "my-1 h-px bg-main-500",
      "header": "block py-2 px-4 text-main-100",
      "item": {
        "base": "flex items-center justify-start py-2 px-4 text-sm text-main-100 cursor-pointer w-full hover:bg-main-500 rounded-md focus:bg-main-500 focus:outline-none transition-colors",
      },
      "style": {
        "auto": "border border-main-200 bg-main-600 text-main-100 rounded-md",
      },
    },
  },
  kbd: {
    "root": {
      "base": "px-3 py-1.5 text-main-100 bg-main-500 border border-main-300 rounded-lg text-xl mx-0.5",
      "icon": "inline-block"
    }
  },
};

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
