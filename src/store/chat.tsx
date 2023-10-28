import { types as t } from "mobx-state-tree"
import { IMessage, chatml } from "@/lib/prompt"
import { ollama } from "@/lib/ollama"
import { randomId } from "@/lib/utils"

export const Message = t
  .model("Message", {
    role: t.optional(t.string, "user"),
    content: t.string,
    date: t.optional(t.Date, () => new Date()),
  })
  .actions((self) => ({
    update(content: string) {
      self.content = content
    },
  }))

export const Chat = t
  .model("Chat", {
    id: t.optional(t.identifier, randomId()),
    model: t.string,
    options: t.optional(
      t.model("Options", {
        temperature: t.optional(t.number, 1),
        maxTokens: t.optional(t.number, 512),
      }),
      {},
    ),
    messages: t.array(Message),
  })
  .actions((self) => ({
    addMessage(message: IMessage) {
      self.messages.push(message)
    },
    onClearConversation() {
      self.messages.clear()
    },
    onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      const input = e.currentTarget.elements[0] as HTMLInputElement
      const content = input.value
      const message = {
        role: "user",
        content,
        date: new Date(),
      }

      self.messages.push(message)
      input.value = ""

      async function respond() {
        const template = chatml([
          ...self.messages,
          {
            role: "assistant",
            content: "",
            closed: false,
          },
        ])
        const stream = ollama(template, self.model)

        const message = Message.create({
          role: "assistant",
          content: "",
        })

        self.addMessage(message)

        for await (const chunk of stream) {
          message.update(message.content + chunk)
        }
      }

      respond()
    },
    setModel(model: string) {
      self.model = model
    },
    updateOptions(options: Partial<typeof self.options>) {
      Object.assign(self.options, options)
    },
  }))
