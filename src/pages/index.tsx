import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useCallback, useEffect, useState } from 'react'
import { set } from "zod";

export default function Home() {
  return (
    <>
      <Head>
        <title>Typing Game</title>
        <meta name="description" content="David's boring typing game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-main-800 font-sans">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl text-main-300 font-bold mb-2">David's Simple Typing Game</h1>
          <Game />
        </div>
      </main>
    </>
  );
}

function Game() {
  const quote = api.quote.getRandomQuote.useQuery();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteTypoCount, setQuoteTypoCount] = useState(0);
  const [quoteStartTime, setQuoteStartTime] = useState(0);
  const [quoteElapsedTime, setQuoteElapsedTime] = useState(0);
  const [quoteWPM, setQuoteWPM] = useState(0);
  const [quoteAccuracy, setQuoteAccuracy] = useState(0);
  const [quoteCompleted, setQuoteCompleted] = useState(false);

  function getNewQuote() {
    quote.remove();
    quote.refetch();
    setQuoteIndex(0);
    setQuoteTypoCount(0);
    setQuoteStartTime(0);
    setQuoteElapsedTime(0);
    setQuoteWPM(0);
    setQuoteAccuracy(0);
    setQuoteCompleted(false);
  }

  function calculateWPM() {
    let words = quote.data?.text.slice(0, quoteIndex).split(" ");
    let wordCount = words?.length;
    let timeInMinutes = quoteElapsedTime / 1000 / 60;
    if (timeInMinutes === 0 || wordCount === 0 || wordCount === undefined) {
      return 0;
    } else {
      return Math.round(wordCount / timeInMinutes);
    }
  }

  function calculateAccuracy() {
    let accuracy = quoteIndex / (quoteIndex + quoteTypoCount);
    if (accuracy === undefined || isNaN(accuracy)) {
      return 0;
    } else {
      return Math.round(accuracy * 100);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);


  function handleKeyDown(event: KeyboardEvent) {
    const { key } = event;

    // Handle game logic
    if (key === quote.data?.text[quoteIndex]) {
      // Check if we are at the start of the quote
      if (quoteIndex === 0) {
        setQuoteStartTime(Date.now());
      }
      
      // Check if we are at the end of the quote
      if (quoteIndex === quote.data.text.length - 1) {
        setQuoteCompleted(true);
      }
      
      setQuoteIndex((prev) => prev + 1);
      setQuoteElapsedTime(Date.now() - quoteStartTime);
    } else if (key === "Backspace") {
      // Check if last character was a space
      if (quoteIndex > 0 && quote.data?.text[quoteIndex - 1] === " ") {
        setQuoteIndex((prev) => prev - 1);
      }
    } else if (key.length === 1) { // Is not shift, control, alt, command, option, caps lock, or tab
      setQuoteTypoCount((prev) => prev + 1);
    }

    setQuoteWPM(calculateWPM());
    setQuoteAccuracy(calculateAccuracy());

    // Handle reset
    if (key === "Escape" || key === "Enter") {
      getNewQuote();
    }
  }

  return <>
    <div className="flex items-center justify-center gap-4">
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-2xl text-main-100">Time</p>
      <p className="text-2xl text-main-100">{quoteElapsedTime / 1000}s</p>
    </div>
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-2xl text-main-100">Typos</p>
      <p className="text-2xl text-main-100">{quoteTypoCount}</p>
    </div>
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-2xl text-main-100">WPM</p>
      <p className="text-2xl text-main-100">{quoteWPM}</p>
    </div>
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-2xl text-main-100">Accuracy</p>
      <p className="text-2xl text-main-100">{quoteAccuracy}%</p>
    </div>
  </div>
  {
  quoteCompleted 
    ? <button 
        className="rounded-full bg-main-400 text-main-100 px-10 py-3 font-semibold no-underline transition hover:bg-main-500" 
        onClick={getNewQuote}
      >New Quote</button>
    : <>{quote.data ? <GameText quoteText={quote.data.text} index={quoteIndex} /> : <Loading />}</>
  }
  </>
}

function GameText({ quoteText, index }: { quoteText: string, index: number }) {
  return (
    <div className="text-3xl">
      <span className="text-main-50">{quoteText.slice(0, index)}</span>
      <span className="text-main-400">{quoteText.slice(index)}</span>
    </div>
  );
}

function Loading() {
  return <>
    <svg aria-hidden="true" className="inline w-8 h-8 text-main-200 animate-spin dark:text-main-600 fill-main-600 dark:fill-main-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <span className="sr-only">Loading...</span>
  </>
};

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
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
