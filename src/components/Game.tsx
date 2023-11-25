import { api } from "@/utils/api";
import { useEffect, useState } from 'react';
import { Spinner, Button, Kbd } from "flowbite-react";

export function Game({ paragraphType, inputText, inputSetter, inputFocus }: { paragraphType: ParagraphType, inputText: string, inputSetter: (inputText: string) => void, inputFocus: boolean }) {
  // const quote = api.quote.getRandomQuote.useQuery();
  const quote = api.quote.getParagraph.useQuery({ type: paragraphType });
  const quoteIndex = (inputText.length - 1 > 0) ? inputText.length - 1 : 0;

  const [quoteTypoCount, setQuoteTypoCount] = useState(0);
  const [quoteStartTime, setQuoteStartTime] = useState(0);
  const [quoteElapsedTime, setQuoteElapsedTime] = useState(0);
  const [quoteWPM, setQuoteWPM] = useState(0);
  const [quoteAccuracy, setQuoteAccuracy] = useState(0);
  const [quoteCompleted, setQuoteCompleted] = useState(false);

  function getNewQuote() {
    quote.remove();
    quote.refetch().then(() => {
      setQuoteTypoCount(0);
      setQuoteStartTime(0);
      setQuoteElapsedTime(0);
      setQuoteWPM(0);
      setQuoteAccuracy(0);
      setQuoteCompleted(false);
      inputSetter("");
    }).catch((err) => {
      console.error(err);
    });
  }

  function calculateWPM() {
    const words = quote.data?.slice(0, quoteIndex).split(" ");
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

  // Handle reset shortcuts
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  function handleKeyDown(event: KeyboardEvent) {
    if ((event.key === "Escape" || event.key === "Enter") && quoteCompleted) {
      getNewQuote();
    }
  }

  // Paragraph type changed
  useEffect(() => {
    getNewQuote();

    return () => {
      quote.remove();
    };
  }, [paragraphType]);

  // Handle text input
  useEffect(() => {
    handleInput(inputText);
  }, [inputText]);

  function handleInput(inputText: string) {
    const inputWordCount = inputText.split(" ").length;
    const quoteWordCount = quote.data?.split(" ").length;

    const latestWord = inputText.split(" ").at(-1);
    const latestWordLength = latestWord?.length;
    const quoteCurrentWord = quote.data?.split(" ").at(inputWordCount - 1);

    const latestLetter = inputText.at(-1);
    const quoteCurrentLetter = quoteCurrentWord?.at((latestWordLength ?? 1) - 1);

    // Handle game logic
    if (latestLetter === quoteCurrentLetter) {
      // Check if we are at the start of the quote
      if (inputText.length === 1) {
        setQuoteStartTime(Date.now());
      }

      // Check if we are at the end of the quote by making sure the last word is correct
      if (inputWordCount === quoteWordCount && latestWord === quoteCurrentWord && latestWordLength === quoteCurrentWord?.length) {
        setQuoteCompleted(true);
      }

      setQuoteElapsedTime(Date.now() - quoteStartTime);
    } else if (latestLetter !== " ") {
      setQuoteTypoCount((prev) => prev + 1);
    }

    setQuoteWPM(calculateWPM());
    setQuoteAccuracy(calculateAccuracy());
  }

  return <>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-main-100">Time</p>
        <p className="text-2xl text-main-100">{quoteElapsedTime / 1000}s</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-main-100">Typos</p>
        <p className="text-2xl text-main-100">{quoteTypoCount}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-main-100">WPM</p>
        <p className="text-2xl text-main-100">{quoteWPM}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-main-100">Accuracy</p>
        <p className="text-2xl text-main-100">{quoteAccuracy}%</p>
      </div>
    </div>
    { quoteCompleted
      ? <NewQuoteBox onClick={getNewQuote} />
      : <>{quote.data ? <GameText quoteText={quote.data} inputText={inputText} inputFocus={inputFocus} /> : <Spinner color="primary" />}</>}
  </>;
}

function GameText({ quoteText, inputText, inputFocus }: { quoteText: string, inputText: string, inputFocus: boolean }) {
  return (
    <div className={`text-3xl max-w-[80%] relative`}>
      <p className={`absolute top-[40%] left-1/2 translate-x-[-50%] translate-y-[-50%] text-main-200 text-xl transition-all ${(inputFocus) ? "opacity-0" : "opacity-100"}`}>Click to start typing</p>
      <div className={`h-full w-full text-left transition-all ${(inputFocus) ? "blur-none" : "blur-md"}`}>
        {
          (() => {
            const inputWords = inputText.split(" ");
            const quoteWords = quoteText.split(" ");
            const elements: JSX.Element[] = [];

            const cursorStyle = inputFocus ? "before:content-[''] before:w-[2px] before:h-6 before:bg-main-100 before:inline-block ml-[-2px] before:animate-pulse" : "";

            // Handle already typed words character by character
            for (const [inputWordIndex, inputWord] of inputWords.entries()) {
              const quoteWord = quoteWords[inputWordIndex];
              let addCursorBeforeSpace = false;

              if (quoteWord !== undefined) {
                // Compare characters in the typed word to the quote word
                for (const [quoteCurrentWordLetterIndex, quoteCurrentWordLetter] of quoteWord.split("").entries()) {
                  if (quoteCurrentWordLetterIndex >= inputWord.length) {
                    // Handle the cursor
                    if (inputWordIndex === inputWords.length - 1 && quoteCurrentWordLetterIndex === inputWord.length) {
                      elements.push(<span className={`text-main-400 ${cursorStyle}`}>{quoteCurrentWordLetter}</span>);
                    } else {
                      elements.push(<span className={`text-main-400`}>{quoteCurrentWordLetter}</span>);
                    }
                    continue;
                  }

                  const reachedEndOfWord = quoteCurrentWordLetterIndex >= quoteWord.length - 1;
                  const isLastWord = inputWordIndex >= inputWords.length - 1;
                  addCursorBeforeSpace = reachedEndOfWord && isLastWord;

                  const inputCurrentWordLetter = inputWord[quoteCurrentWordLetterIndex];
                  if (quoteCurrentWordLetter !== inputCurrentWordLetter) {
                    elements.push(<span className={`text-red-400 $()`}>{quoteCurrentWordLetter}</span>);
                  } else {
                    elements.push(<span className={`text-main-50`}>{quoteCurrentWordLetter}</span>);
                  }
                }

                // Handle characters typed beyond the word in the quote
                if (inputWord.length > quoteWord.length) {
                  for (const [extraLetterIndex, extraLetter] of inputWord.slice(quoteWord.length).split("").entries()) {
                    elements.push(<span className={`text-red-400`}>{extraLetter}</span>);
                  }
                }
                // Handle space
                // Add cursor if we are at the end of the last typed word
                if (addCursorBeforeSpace) {
                  elements.push(<span className={`text-main-400 ${cursorStyle}`}> </span>);
                } else {
                  elements.push(<span> </span>);
                }
              }
            }

            // Hendle not yet typed words
            for (const [wordIndex, word] of quoteWords.slice(inputWords.length).entries()) {
              for (const [letterIndex, letter] of word.split("").entries()) {
                elements.push(<span className={`text-main-400`}>{letter}</span>);
              }

              // Handle space
              elements.push(<span> </span>);
            }

            return elements;
          })()
        }
      </div>
    </div>
  );
}

function NewQuoteBox({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-10 z-20">
      <Button color="primary" onClick={onClick} size="xl" className="text-2xl px-6 py-3">New Quote</Button>
      <p className="text-2xl text-main-100">Or press <Kbd>Enter</Kbd> to restart</p>
    </div>
  );
}

export enum ParagraphType {
  Quote = "quote",
  WORDS_20 = "20words",
  WORDS_50 = "50words",
  WORDS_100 = "100words",
  WORDS_200 = "200words",
}

export function paragraphTypeFromStr(paragraphTypeStr: string): ParagraphType {
  switch (paragraphTypeStr) {
    case "quote":
      return ParagraphType.Quote;
    case "20words":
      return ParagraphType.WORDS_20;
    case "50words":
      return ParagraphType.WORDS_50;
    case "100words":
      return ParagraphType.WORDS_100;
    case "200words":
      return ParagraphType.WORDS_200;
    default:
      return ParagraphType.Quote;
  }
}