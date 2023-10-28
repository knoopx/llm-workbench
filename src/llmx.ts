// import { PassThrough } from "stream";
// import dedent from "dedent";
export class Stream extends ReadableStream {
  async text() {
    let text = "";
    for await (const chunk of this) {
      text += chunk;
    }
    return text;
  }
}

export function llmx(strings: TemplateStringsArray, ...values: any[]) {
  const tokens = strings.raw
    .reduce((acc, curr) => [...acc, curr, values.shift()], [])
    .filter(Boolean);

  let state = {};

  const stream = new Stream({
    async start(controller) {
      let buffer = "";
      for (const token of tokens) {
        if (typeof token === "string") {
          controller.enqueue(token);
          buffer += token;
        } else if (typeof token === "function") {
          const result = token({ buffer, state });
          console.log(result)
          if (result instanceof Stream) {
            for await (const chunk of result) {
              controller.enqueue(chunk);
            }
          } else {
            controller.enqueue(result);
          }
          buffer += token;
        }
      }
      controller.close();
    },
  });

  return [stream, state];
}
