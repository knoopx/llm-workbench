import { stdout } from "process";
import { llmx } from "./src/llmx";
import { ollama } from "./src/ollama";

// function summarize(text) {
//   return llmx`<|im_start|>system
// You are a summarization assistant. Given a user message, summarize it in a single sentence.
// <|im_start|>user
// ${text}<|im_end|>
// <|im_start|>assistant
// ${async ({ buffer, state }) => {
//   return (state.response = ollama(buffer, "zephyr"));
// }}`;
// }

function chat(text: string) {
  return llmx`<|im_start|>system
You are a friendly chatbot that speaks like a regular friend using common language.<|im_end|>
<|im_start|>user
${text}<|im_end|>
<|im_start|>assistant
${({ buffer, state }) => {
  // return (state.response = summarize(ollama(buffer, "zephyr")));
  // console.log(buffer)
  const stream = ollama(buffer, "zephyr");
  return stream
  // console.log(stream)

  // const text = await stream.text();
  // console.log(text)
  // return text;

  // for await (const chunk of state.response) {
  //   stdout.write(chunk);
  // }
}}`;
}

const [stream, state] = chat("Who is Debord?");
// for await (const chunk of stream) {
//   stdout.write(chunk);
// }

for await (const chunk of stream) {
  stdout.write(chunk);
}

// console.log(state.response.values());

// const render = function ({ currentUser }) {
//   return pipe`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Example</title>
//         <link rel='stylesheet' href='entrypoint.css'>
//       </head>
//       <body>
//         ${async () =>
//           React.renderToNodeStream(
//             React.createElement(App, {
//               currentUser: await currentUser,
//             })
//           )}
//         <script>window.__INITIAL_STATE__ = ${async () =>
//           JSON.stringify({
//             currentUser: await currentUser,
//           })}
//         <script src='entrypoint.js></script>
//       </body>
//     </html>
//   `;
// };
