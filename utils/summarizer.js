import { OpenAI } from "openai";
import dotenv from "dotenv"
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



export const summarizeText = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Summarize this note in 2-3 sentences:\n\n${text}`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};
