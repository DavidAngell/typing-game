import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { ParagraphType } from "@/components/Game";

async function getWordList(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>)  {
  const wordList = await db.wordList.findFirst();
  if (!wordList) {
    throw new Error("No word list found");
  }
  return wordList.words.split(" ");
}

function getNRandomWords(words: string[], n: number) {
  const randomWords = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    randomWords.push(words[randomIndex]);
  }
  return randomWords.join(" ");
}

export const quoteRouter = createTRPCRouter({
  getRandomQuote: publicProcedure.query(async ({ ctx }) => {
    // Get a random quote from the database
    const quotes = await ctx.db.quote.findMany();
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }),

  getParagraph: publicProcedure
    .input(z.object({ type: z.nativeEnum(ParagraphType) }))
    .query(async (opts) => {
      const { type } = opts.input;
      const { ctx } = opts;

      let paragraph: string | undefined = undefined;

      switch (type) {
        case ParagraphType.Quote:
          const quotes = await ctx.db.quote.findMany();
          const randomIndex = Math.floor(Math.random() * quotes.length);
          paragraph = quotes[randomIndex]?.text;
          break;
        case ParagraphType.WORDS_20:
          paragraph = getNRandomWords(await getWordList(ctx.db), 20);
          break;
        case ParagraphType.WORDS_50:
          paragraph = getNRandomWords(await getWordList(ctx.db), 50);
          break;
        case ParagraphType.WORDS_100:
          paragraph = getNRandomWords(await getWordList(ctx.db), 100);
          break;
        case ParagraphType.WORDS_200:
          paragraph = getNRandomWords(await getWordList(ctx.db), 200);
          break;
      }

      if (!paragraph) {
        return `According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway. Because bees don’t care what humans think is impossible.” SEQ. 75 - “INTRO TO BARRY” INT. BENSON HOUSE - DAY ANGLE ON: Sneakers on the ground. Camera PANS UP to reveal BARRY BENSON’S BEDROOM ANGLE ON: Barry’s hand flipping through different sweaters in his closet. BARRY Yellow black, yellow black, yellow black, yellow black, yellow black, yellow black...oohh, black and yellow... ANGLE ON: Barry wearing the sweater he picked, looking in the mirror. BARRY (CONT’D) Yeah, let’s shake it up a little. He picks the black and yellow one. He then goes to the sink, takes the top off a CONTAINER OF HONEY, and puts some honey into his hair. He squirts some in his mouth and gargles. Then he takes the lid off the bottle, and rolls some on like deodorant. CUT TO: INT. BENSON HOUSE KITCHEN - CONTINUOUS Barry’s mother, JANET BENSON, yells up at Barry. JANET BENSON Barry, breakfast is ready! CUT TO:`;
      } else {
        return paragraph;
      } 
    }),
});
