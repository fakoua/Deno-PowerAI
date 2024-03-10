import { ChatCompletionRequest, getChatResponse } from "./src/ai.ts";

await execCommand("cls");
console.log("Welcome to PowerAI");
console.log("Type 'exit' to quit");

while (true) {
  const userRequest = prompt("PowerAI:> ");
  if (userRequest === "exit") {
    break;
  }

  if (userRequest !== null && userRequest !== "") {
    const result = await askGpt(userRequest);
    console.log(result);
    const res = await execCommand(result);
    console.log(res);
  }
}

async function askGpt(userRequest: string): Promise<string> {
  const req: ChatCompletionRequest = {
    messages: [
      {
        role: "system",
        content:
          "You are a powershell command generation assistant. You will be given a description of the commands and a text description on what needs to be done. Respond with only the command without explanation and without ```, you may add arguments and parameters based on the question. if you need a directory path assume the user wants the current directory. Try always to use single quote.",
      },

      {
        role: "user",
        content: userRequest,
      },
    ],
    model: "gpt-3.5-turbo",
  };

  return await getChatResponse(req) ?? "";
}

async function execCommand(command: string): Promise<string> {
  const p = new Deno.Command("powershell.exe", {
    args: [
      "-Command",
      `${command}`,
    ],
    stderr: "piped",
    stdout: "piped",
  });
  //const { code, stdout, stderr } = await p.output();
  const { stdout } = await p.output();
  let output = new TextDecoder().decode(stdout);
  output = output.replace(/\r?\n+$/, "");
  output = output.trimEnd();
  return `${output}\r\n`;
}
