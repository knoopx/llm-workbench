import Mustache from "mustache"
import { getParent, types as t } from "mobx-state-tree"
import { IMessage } from "@/lib/prompt"
import { randomId } from "@/lib/utils"
import { Message } from "./Message"
import { CHAT_TEMPLATES } from "./Presets"
Mustache.escape = (text) => text

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
    attachments: t.array(t.string),
    system_message: t.optional(
      t.string,
      `You are a helpful assistant. Current time is {{time}}.`,
    ),
    user_message: t.optional(
      t.string,
      "My name is Victor Martinez, I was born in 1985 and I live in Barcelona. I'm a professional software developer. I love non-commercial music, DIY culture, and FOSS. I would like you to respond with short and concise answers. Skip apologies and any form of social formalism.",
    ),
    assistant_message: t.optional(
      t.string,
      "In order to provide short and concise responses without any unnecessary apologies or social formalities, I will get straight to the point in my communication. This approach allows us to be efficient with our time and focus on conveying important information clearly and accurately. By cutting out superfluous language, we can avoid wasting words and ensure that our messages are direct and impactful. Additionally, this style of communication promotes a more casual and relaxed interaction between individuals, allowing for a more natural flow of conversation without any artificial barriers or obstacles. Overall, short and concise answers with no apologies or social formalities enable us to communicate",
    ),
    options: t.optional(InferenceOptions, {}),
    messages: t.array(Message),
    history: t.array(Message),
    useSystemMessage: t.optional(t.boolean, true),
    useUserMessage: t.optional(t.boolean, true),
    useAssistantMessage: t.optional(t.boolean, true),
  })
  .views((self) => ({
    get nonEmptyMessages() {
      return self.messages.filter((message) => message.content.length)
    },
    get systemMessage() {
      return Mustache.render(self.system_message, {
        time: () => new Date().toISOString(),
        retrieval: self.attachments.join("\n"),
      })
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
      const messages = [
        {
          role: "system",
          content: this.systemMessage,
        },
        self.useUserMessage && {
          role: "user",
          content: self.user_message,
        },
        self.useAssistantMessage && {
          role: "assistant",
          content: self.assistant_message,
        },
        ...self.messages,
        {
          role: "assistant",
          content: "",
          open: true,
        },
      ].filter(Boolean)

      return Mustache.render(self.chat_template, {
        upperCase: () => (text, render) => render(text).toUpperCase(),
        retrieval: self.attachments.join("\n"),
        system: this.systemMessage,
        user: self.user_message,
        prompt: this.lastMessage.content,
        messages: messages
          .filter((message) => message.open || message.content.length)
          .map((message) => ({
            closed: !message.open,
            ...message,
          })),
      })
    },
  }))
  .actions((self) => ({
    setAttachments(attachments: string[]) {
      self.attachments.replace(attachments)
    },
    setUseAssistantMessage(value: boolean) {
      self.useAssistantMessage = value
    },
    setUseSystemMessage(value: boolean) {
      self.useSystemMessage = value
    },
    setUseUserMessage(value: boolean) {
      self.useUserMessage = value
    },
    setChatTemplate(template: string) {
      self.chat_template = template
    },
    setUserMessage(message: string) {
      self.user_message = message
    },
    setAssistantMessage(message: string) {
      self.assistant_message = message
    },
    addMessage(message: IMessage) {
      self.messages.push(message)
    },
    onClearConversation() {
      self.messages.clear()
    },
    pop() {
      self.messages.pop()
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
