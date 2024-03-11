import OpenAIService from "./src/openai-service.ts";

await execCommand("cls");
console.log("Welcome to PowerAI");
console.log("Type 'exit' to quit");

const openai = new OpenAIService();

while (true) {
  const userRequest = prompt("PowerAI:> ");
  if (userRequest === "exit") {
    break;
  }

  if (userRequest !== null && userRequest !== "") {
    const result = await openai.askGpt(userRequest);
    console.log(result);
    const res = await execCommand(result);
    console.log(res);
  }
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
