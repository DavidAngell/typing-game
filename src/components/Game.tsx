import { api } from "@/utils/api";
import { useEffect, useState } from 'react';
import { Loading } from "@/components/Loading";

export function Game() {
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
    quote.refetch().then(() => {
      setQuoteIndex(0);
      setQuoteTypoCount(0);
      setQuoteStartTime(0);
      setQuoteElapsedTime(0);
      setQuoteWPM(0);
      setQuoteAccuracy(0);
      setQuoteCompleted(false);
    }).catch((err) => {
      console.error(err);
    });
  }

  function calculateWPM() {
    const words = quote.data?.text.slice(0, quoteIndex).split(" ");
    const wordCount = words?.length;
    const timeInMinutes = quoteElapsedTime / 1000 / 60;
    if (timeInMinutes === 0 || wordCount === 0 || wordCount === undefined) {
      return 0;
    } else {
      return Math.round(wordCount / timeInMinutes);
    }
  }

  function calculateAccuracy() {
    const accuracy = quoteIndex / (quoteIndex + quoteTypoCount);
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
    {quoteCompleted
      ? <button
        className="rounded-full bg-main-400 text-main-100 px-10 py-3 font-semibold no-underline transition hover:bg-main-500"
        onClick={getNewQuote}
      >New Quote</button>
      : <>{quote.data ? <GameText quoteText={quote.data.text} index={quoteIndex} /> : <Loading />}</>}
  </>;
}

function GameText({ quoteText, index }: { quoteText: string, index: number }) {
  return (
    <div className="text-3xl">
      <span className="text-main-50">{quoteText.slice(0, index)}</span>
      <span className="text-main-400">{quoteText.slice(index)}</span>
    </div>
  );
}