import Mustache from "mustache"
import { getParent, types as t } from "mobx-state-tree"
import { IMessage } from "@/lib/prompt"
import { randomId } from "@/lib/utils"
import { Message } from "./Message"
import { CHAT_TEMPLATES } from "./Presets"

const InferenceOptions = t.model("Options", {
  temperature: t.optional(t.number, 0.7),
  top_k: t.optional(t.number, 40),
  top_p: t.optional(t.number, 0.9),
  repeat_penalty: 1.18,
  num_predict: t.optional(t.number, 128),
})

export const Chat = t
  .model("Chat", {
    id: t.optional(t.identifier, randomId),
    model: t.string,
    chat_template: t.optional(t.string, Object.values(CHAT_TEMPLATES)[0]),
    system_message: t.optional(
      t.string,
      `You are a helpful assistant. Current time is {{time}}.`,
    ),
    user_message: t.optional(
      t.string,
      "My name is Victor Martinez, I was born in 1985 and I live in Barcelona. I'm a professional software developer. I love non-commercial music, DIY culture, and FOSS. I would like you to respond with short and concise answers. Skip apologies and any form of social formalism.",
    ),
    options: t.optional(InferenceOptions, {}),
    messages: t.array(Message),
  })
  .views((self) => ({
    get nonEmptyMessages() {
      return self.messages.filter((message) => message.content !== "")
    },
    get systemMessage() {
      return self.system_message.replace(/{{time}}/g, new Date().toISOString())
    },
    get userMessages() {
      return this.nonEmptyMessages.filter((message) => message.role === "user")
    },
    get assistantMessages() {
      return this.nonEmptyMessages.filter(
        (message) => message.role === "assistant",
      )
    },
    get lastMessage() {
      return this.nonEmptyMessages[this.nonEmptyMessages.length - 1]
    },
    get lastUserMessage() {
      return this.userMessages[this.userMessages.length - 1]
    },
    get lastAssistantMessage() {
      return this.assistantMessages[this.assistantMessages.length - 1]
    },
    get title() {
      if (this.userMessages.length === 0) return `New Chat with ${self.model}`
      return this.lastMessage.content.slice(0, 20)
    },
    get template() {
      return Mustache.render(self.chat_template, {
        upperCase: () => (text, render) => render(text).toUpperCase(),
        system: this.systemMessage,
        user: self.user_message,
        prompt: this.lastMessage.content,
        messages: [
          {
            role: "system",
            content: this.systemMessage,
          },
          {
            role: "user",
            content: self.user_message,
          },
          ...self.messages,
          {
            role: "assistant",
            content: "",
            closed: false,
          },
        ],
      })
    },
  }))
  .actions((self) => ({
    setChatTemplate(template: string) {
      self.chat_template = template
    },
    setUserMessage(message: string) {
      self.user_message = message
    },
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
      if (!content) return

      const message = {
        role: "user",
        content,
        date: new Date(),
      }

      self.messages.push(message)
      input.value = ""

      this.respond()
    },

    async respond() {
      console.log(self.template)

      const { client } = getParent(self, 2)
      const stream = client.completion(self.template, self.model, self.options)

      const message = Message.create({
        role: "assistant",
        content: "",
      })

      this.addMessage(message)

      for await (const chunk of stream) {
        message.update(message.content + chunk)
      }
    },
    regenerate() {
      self.messages.pop()
      this.respond()
    },
    setModel(model: string) {
      self.model = model
    },
    setSystemMessage(message: string) {
      self.system_message = message
    },
    updateOptions(options: Partial<typeof self.options>) {
      Object.assign(self.options, options)
    },
  }))
