import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export enum ParagraphType {
  Quote = "quote",
  WORDS_20 = "20words",
  WORDS_50 = "50words",
  WORDS_100 = "100words",
  WORDS_200 = "200words",
}

async function getWordList(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>)  {
  let wordList = await db.wordList.findFirst();
  if (!wordList) {
    throw new Error("No word list found");
  }
  return wordList.words.split(" ");
}

function getNRandomWords(words: string[], n: number) {
  let randomWords = [];
  for (let i = 0; i < n; i++) {
    let randomIndex = Math.floor(Math.random() * words.length);
    randomWords.push(words[randomIndex]);
  }
  return randomWords.join(" ");
}

export const quoteRouter = createTRPCRouter({
  getRandomQuote: publicProcedure.query(async ({ ctx }) => {
    // Get a random quote from the database
    let quotes = await ctx.db.quote.findMany();
    let randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }),

  // getParagraph: publicProcedure
  //   .input(z.object({ type: z.nativeEnum(ParagraphType) }))
  //   .query(async (opts) => {
  //     let { type } = opts.input;
  //     let { ctx } = opts;

  //     let paragraph: string | undefined = undefined;

  //     switch (type) {
  //       case ParagraphType.Quote:
  //         let quotes = await ctx.db.quote.findMany();
  //         let randomIndex = Math.floor(Math.random() * quotes.length);
  //         paragraph = quotes[randomIndex]?.text;
  //         break;
  //       case ParagraphType.WORDS_20:
  //         let words = await getWordList(ctx.db);
  //         paragraph = getNRandomWords(words, 20);
  //         break;
  //       case ParagraphType.WORDS_50:
  //         words = await getWordList(ctx.db);
  //         paragraph = getNRandomWords(words, 50);
  //         break;
  //       case ParagraphType.WORDS_100:
  //         words = await getWordList(ctx.db);
  //         paragraph = getNRandomWords(words, 100);
  //         break;
  //       case ParagraphType.WORDS_200:
  //         words = await getWordList(ctx.db);
  //         paragraph = getNRandomWords(words, 200);
  //         break;
  //     }

  //     if (!paragraph) {
  //       return "According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway. Because bees don’t care what humans think is impossible.” SEQ. 75 - “INTRO TO BARRY” INT. BENSON HOUSE - DAY ANGLE ON: Sneakers on the ground. Camera PANS UP to reveal BARRY BENSON’S BEDROOM ANGLE ON: Barry’s hand flipping through different sweaters in his closet. BARRY Yellow black, yellow black, yellow black, yellow black, yellow black, yellow black...oohh, black and yellow... ANGLE ON: Barry wearing the sweater he picked, looking in the mirror. BARRY (CONT’D) Yeah, let’s shake it up a little. He picks the black and yellow one. He then goes to the sink, takes the top off a CONTAINER OF HONEY, and puts some honey into his hair. He squirts some in his mouth and gargles. Then he takes the lid off the bottle, and rolls some on like deodorant. CUT TO: INT. BENSON HOUSE KITCHEN - CONTINUOUS Barry’s mother, JANET BENSON, yells up at Barry. JANET BENSON Barry, breakfast is ready! CUT TO: "Bee Movie" - JS REVISIONS 8/13/07 1. INT. BARRY’S ROOM - CONTINUOUS BARRY Coming! SFX: Phone RINGING. Barry’s antennae vibrate as they RING like a phone. Barry’s hands are wet. He looks around for a towel. BARRY (CONT’D) Hang on a second! "
  //     } else {
  //       return paragraph;
  //     } 
  //   }),
});
