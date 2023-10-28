export type IMessage = {
  role: string
  content: string
}

function message({
  role,
  content,
  closed = true,
}: {
  role: string
  content: string
  open?: boolean
}) {
  return `<|im_start|>${role}
${content}${closed ? "<|im_end|>" : ""}`
}

export function chatml(messages: Message[]) {
  return messages.map((props) => message(props)).join("\n")
}
