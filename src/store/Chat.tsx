import Mustache from "mustache"
import { destroy, getParent, types as t } from "mobx-state-tree"
import { IMessage } from "@/lib/prompt"
import { randomId } from "@/lib/utils"
import { Message } from "./Message"
import { CHAT_TEMPLATES } from "./Presets"

Mustache.escape = (text) => text

const DEFAULT_SYSTEM_MESSAGE = `A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions. Current time is {{time}}.`
const DEFAULT_USER_MESSAGE = ``
const DEFAULT_ASSISTANT_MESSAGE = `In order to provide short and concise responses without any unnecessary apologies or social formalities, I will get straight to the point in my communication. This approach allows us to be efficient with our time and focus on conveying important information clearly and accurately. By cutting out superfluous language, we can avoid wasting words and ensure that our messages are direct and impactful. Additionally, this style of communication promotes a more casual and relaxed interaction between individuals, allowing for a more natural flow of conversation without any artificial barriers or obstacles. Overall, short and concise answers with no apologies or social formalities enable us to communicate`

const InferenceOptions = t.model("Options", {
  temperature: t.optional(t.number, 0.7),
  top_k: t.optional(t.number, 40),
  top_p: t.optional(t.number, 0.9),
  repeat_penalty: 1.18,
  num_predict: t.optional(t.number, 256),
})

export const Chat = t
  .model("Chat", {
    id: t.optional(t.identifier, randomId),
    prompt: t.optional(t.string, ""),
    model: t.maybeNull(t.string),
    chat_template: t.optional(t.string, Object.values(CHAT_TEMPLATES)[0]),
    attachments: t.array(t.string),
    system_message: t.optional(t.string, DEFAULT_SYSTEM_MESSAGE),
    user_message: t.optional(t.string, DEFAULT_USER_MESSAGE),
    assistant_message: t.optional(t.string, DEFAULT_ASSISTANT_MESSAGE),
    options: t.optional(InferenceOptions, {}),
    messages: t.array(Message),
    history: t.array(Message),
  })
  .views((self) => ({
    get nonEmptyMessages() {
      return self.messages.filter((message) => message.content.length)
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
      if (this.userMessages.length === 0) {
        if (self.model) {
          return `New Chat with ${self.model}`
        }
        return `New Chat`
      }
      return this.lastMessage?.content.slice(0, 20)
    },
    renderTemplate(template: string, extra = {}) {
      try {
        return Mustache.render(template, {
          upperCase: () => (text, render) => render(text).toUpperCase(),
          attachments: self.attachments.join("\n"),
          system: self.system_message,
          user: self.user_message,
          assistant: self.assistant_message,
          prompt: this.lastUserMessage?.content,
          time: new Date().toLocaleString(),
          ...extra,
        })
      } catch (e) {
        return e.message
      }
    },
    get template() {
      const messages = [
        ...self.history,
        ...self.messages,
        {
          role: "assistant",
          content: "",
          open: true,
        },
      ].filter(Boolean)

      let result = this.renderTemplate(self.chat_template, {
        messages: messages
          .filter((message) => message.open || message.content.length)
          .map((message) => ({
            closed: !message.open,
            ...message,
          })),
      })

      let last = null
      while (last !== result) {
        last = result
        result = this.renderTemplate(result)
      }
      return result
    },
  }))
  .actions((self) => ({
    setPrompt(prompt: string) {
      self.prompt = prompt
    },
    addHistoryMessage(message: IMessage) {
      self.history.push(message)
    },
    setAttachments(attachments: string[]) {
      self.attachments.replace(attachments)
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
      const message = self.lastMessage
      if (message.role === "user") {
        self.prompt = message.content
      }
      self.messages.pop()
    },
    userMessage(content: string) {
      if (!content) return

      const message = {
        role: "user",
        content,
        date: new Date(),
      }

      self.messages.push(message)

      this.respond()
    },
    async respond() {
      const { client } = getParent(self, 2)
      const stream = client.completion(self.template, self.model, self.options)

      const message = Message.create({
        role: "assistant",
        content: "",
      })

      this.addMessage(message)

      for await (const chunk of stream) {
        message.update({ content: message.content + chunk })
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
    remove(thing: any) {
      destroy(thing)
    },
  }))
