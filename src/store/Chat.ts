import {
  toPromise,
  TagToken,
  Context,
  Emitter,
  TopLevelToken,
  Value,
  Tag,
  Liquid,
} from "liquidjs"

import MiniSearch from "minisearch"

import { destroy, detach, isAlive, types as t } from "mobx-state-tree"
import { randomId } from "@/lib/utils"
import { Message } from "./Message"
import { Instance } from "mobx-state-tree"

import { Agent } from "./Agent"
import { Attachment } from "./Attachment"
import { autorun } from "mobx"

export const Chat = t
  .model("Chat", {
    id: t.optional(t.identifier, randomId),
    prompt: t.optional(t.string, ""),
    agent: t.safeReference(Agent),
    attachments: t.array(Attachment),
    messages: t.array(Message),
    embeddingModelName: t.optional(t.string, "Supabase/gte-small"),
    createdAt: t.optional(t.Date, () => new Date()),
  })
  .volatile((self) => ({
    abortController: null as AbortController | null,
  }))
  .views((self) => ({
    get nonEmptyMessages() {
      return self.messages.filter((m) => !m.isEmpty)
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
        if (self.agent) {
          return `New Chat with ${self.agent.name}`
        }
        return `New Chat`
      }
      return this.lastMessage?.content.slice(0, 20)
    },
    get modifiedAt() {
      return this.lastMessage?.date ?? self.createdAt
    },
    get documents() {
      return Object.fromEntries(
        self.attachments.flatMap((attachment) => {
          return attachment.lines.map((line: string, i) => {
            return [
              `File "${attachment.path}", Line ${i + 1}`,
              [attachment.lines[i - 1], line, attachment.lines[i + 1]]
                .join(" ")
                .trim(),
            ].filter(Boolean)
          })
        }),
      )
    },
    get index() {
      let miniSearch = new MiniSearch({
        fields: ["id", "text"], // fields to index for full-text search
        storeFields: ["id", "text"], // fields to return with search results
      })

      Object.keys(this.documents).forEach((key) => {
        miniSearch.add({ id: key, text: this.documents[key] })
      })
      return miniSearch
    },
    get isRunning() {
      return !!self.abortController
    },
    get locals() {
      return {
        prompt: this.lastUserMessage?.content || self.prompt,
        attachments: self.attachments.map((x) => [...new Set(x.lines)]),
      }
    },
  }))

  .actions((self) => ({
    abort() {
      self.abortController?.abort()
      self.update({ abortController: null })
    },
    afterCreate() {
      autorun(() => self.registerTags(self.agent?.engine))
    },
    registerTags(engine) {
      if (!engine) return

      // register("retrieve", async (value, emitter) => {
      //   if (!self.agent || !self.agent.model) return
      //   self.index.search(value).forEach((doc) => {
      //     emitter.write(`- "${doc.text}" (${doc.id})\n`)
      //   })
      // })
    },

    addMessage(message: Instance<typeof Message>) {
      self.messages.push(message)
    },
    clear() {
      self.messages.clear()
    },
    pop() {
      while (self.lastMessage?.role === "assistant") {
        self.messages.pop()
      }

      const content = self.lastMessage?.content
      const lastUserMessage = self.messages.pop()
      if (lastUserMessage) {
        self.prompt = content
      }
    },
    send(content: string, { reply = true } = {}) {
      if (!content) return

      const message = {
        role: "user",
        content,
        date: new Date(),
      }

      self.messages.push(message)

      if (reply) {
        this.reply()
      }
    },
    async reply({ newMessage = true } = {}) {
      if (!self.agent) return

      const messages = self.nonEmptyMessages

      let message

      try {
        const template = await self.agent.buildTemplate(messages, self.locals)

        if (newMessage) {
          messages.push(
            Message.create({
              role: "assistant",
              content: "",
              open: true,
            }),
          )
        } else {
          self.lastMessage.update({ open: true })
        }

        this.abort()
        this.update({ abortController: new AbortController() })

        const stream = self.agent.completion(
          template,
          self.abortController!.signal,
        )

        message = self.lastMessage
        if (newMessage) {
          message = Message.create({
            role: "assistant",
            content: "",
            open: true,
          })
          this.addMessage(message)
        }

        for await (const chunk of stream) {
          if (isAlive(message)) {
            message.update({ content: message.content + chunk })
          } else {
            this.abort()
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return
        }
        const content = "An error occurred. Check the console for more details."
        if (!message) {
          message = Message.create({
            role: "assistant",
            content,
          })
          this.addMessage(message)
        }
        message.update({ content })
        console.error(error)
      } finally {
        message?.update({ open: false })
        this.update({ abortController: null })
      }
    },
    regenerate() {
      self.messages.pop()
      this.reply()
    },
    update(props: Partial<Instance<typeof self>>) {
      Object.assign(self, props)
    },
    remove(thing: any) {
      destroy(thing)
    },
  }))
