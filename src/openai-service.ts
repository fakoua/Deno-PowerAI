import OpenAI from 'openai'

/**
 * Represents a service for interacting with the OpenAI API.
 */
class OpenAIService {
  private readonly openai: OpenAI

  constructor () {
    this.openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    })
  }

  /**
     * Asks the GPT-3.5 Turbo model a question and returns the generated response.
     * @param userRequest - The user's question or request.
     * @returns A promise that resolves to the generated response from the GPT-3.5 Turbo model.
     */
  async askGpt (userRequest: string): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
                        'You are a powershell command generation assistant. You will be given a description of the commands and a text description on what needs to be done. Respond with only the command without explanation and without ```, you may add arguments and parameters based on the question. if you need a directory path assume the user wants the current directory. Try always to use single quote.'
        },

        {
          role: 'user',
          content: userRequest
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      n: 1
    })
    return chatCompletion.choices[0].message.content ?? ''
  }
}

export default OpenAIService