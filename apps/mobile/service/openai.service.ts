import OpenAI from "openai";


export class OpenAiService {
  static async explain(input: string) {
    try {
      const client = new OpenAI(
          {
            apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
          })

      const response = await client.chat.completions.create(
          {
            model: "gpt-4o", messages: [{
              role: "system",
              content: "You will be given text content from a social media" +
                  " post, and your task is to explain it in English."
            }, {
              role: "user",
              content: input
            }]
          }
      );
      for (let i = 0; i < response?.choices.length; i++) {
        console.log(response?.choices[i].message)
      }
      return response?.choices[0].message.content
    } catch (e) {
      console.log("error", e);
    }
  }
}