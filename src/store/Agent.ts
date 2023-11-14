import { Liquid } from "liquidjs"
import { destroy, types as t } from "mobx-state-tree"
import { randomId } from "@/lib/utils"
import { Message } from "./Message"
import { Instance } from "mobx-state-tree"
import { reaction, toJS } from "mobx"
import { AdapterFactory } from "./AdapterFactory"
import { Template } from "./Template"

export const GenerationParams = t.model("Options", {
  temperature: t.optional(t.number, 0.7),
  top_k: t.optional(t.number, 40),
  top_p: t.optional(t.number, 0.9),
  repeat_last_n: t.optional(t.number, -1),
  repeat_penalty: t.optional(t.number, 1.18),
  num_predict: t.optional(t.number, -2),
  num_ctx: t.optional(t.number, 2048),
  stop: t.optional(t.array(t.string), []),
})

const Variable = t.model("Variable", {
  key: t.string,
  value: t.string,
})

type Turn = {
  user: string
  assistant: string
}

export const Agent = t
  .model("Agent", {
    id: t.optional(t.identifier, randomId),
    name: t.optional(t.string, ""),
    model: t.optional(t.string, ""),
    adapter: t.optional(AdapterFactory, {}),
    parameters: t.optional(GenerationParams, {}),
    checkedOptions: t.optional(t.array(t.string), []),
    promptTemplate: t.optional(t.string, ""),
    promptPreview: t.optional(t.string, ""),
    messages: t.array(Message),
    variables: t.array(Variable),
    templates: t.array(Template),
  })

  .views((self) => ({
    get overridedOptions() {
      return Object.fromEntries(
        self.checkedOptions.map((key) => [
          key,
          self.parameters[key as keyof typeof self.parameters],
        ]),
      )
    },
    get templateMap() {
      return new Map(self.templates.map((t) => [t.id, t.content]))
    },
    get engine() {
      const self = this
      return new Liquid({
        relativeReference: false,
        fs: {
          readFileSync(file: string) {
            return self.templateMap.get(file) ?? ""
          },
          async readFile(file: string) {
            return self.templateMap.get(file) ?? ""
          },
          existsSync(file) {
            return self.templateMap.has(file)
          },
          async exists(file) {
            return self.templateMap.has(file)
          },
          contains() {
            return true
          },
          resolve(_root, file, _ext) {
            return file
          },
        },
      })
    },
    async renderTemplate(template: string, extra = {}) {
      const locals = {
        time: new Date().toLocaleString(),
        ...extra,
        ...Object.fromEntries(self.variables.map((v) => [v.key, v.value])),
      }
      const templates = this.engine.parse(template)

      return await this.engine.render(templates, locals)
    },
    turns(messages: Instance<typeof Message>[] = []): Turn[] {
      messages = messages.filter((message) => message.role !== "system")
      let prev: any
      return messages.reduce<Turn[]>((acc, message) => {
        if (prev && message.role === "assistant") {
          acc.push({
            user: prev.content,
            assistant: message.content,
          })
        }
        prev = message

        return acc
      }, [])
    },
    async buildTemplate(messages: Instance<typeof Message>[] = [], extra = {}) {
      messages = [...self.messages, ...messages]

      const turns = this.turns(messages)

      const locals = {
        ...extra,
        system: messages.filter((message) => message.role === "system"),
        turns,
        messages: messages
          .filter((message) => message.open || !message.isEmpty)
          .map((message) => ({
            closed: !message.open,
            ...message,
          })),
      }

      let result = await this.renderTemplate(self.promptTemplate, locals)

      let last = null
      while (last !== result) {
        last = result
        result = await this.renderTemplate(result, extra)
      }
      return result
    },

    completion(prompt: string, signal?: AbortSignal) {
      console.log(prompt)
      return self.adapter.instance.completion(
        prompt,
        self.model,
        this.overridedOptions as typeof self.parameters,
        signal,
      )
    },
  }))
  .actions((self) => ({
    afterCreate() {
      reaction(
        () =>
          [self.promptTemplate, self.templates, self.turns, self.messages].map(
            (x) => toJS(x),
          ),
        this.handlePromptTemplateChange,
      )
      this.handlePromptTemplateChange()
    },
    update(props: Partial<Instance<typeof self>>) {
      Object.assign(self, props)
    },
    remove(thing: any) {
      destroy(thing)
    },
    addVariable(variable: Partial<Instance<typeof Variable>>) {
      self.variables.push(
        Variable.create(variable as Instance<typeof Variable>),
      )
    },
    addMessage(message: Partial<Instance<typeof Message>>) {
      self.messages.push(Message.create(message))
    },
    addTemplate(
      template: Partial<Instance<typeof Template>> &
        Pick<Instance<typeof Template>, "id">,
    ) {
      self.templates.push(Template.create(template))
    },
    removeMessage(message: Instance<typeof Message>) {
      self.messages.remove(message)
    },
    async handlePromptTemplateChange() {
      try {
        const promptPreview = await self.renderTemplate(self.promptTemplate, {
          prompt: "What is your name?",
          messages: [
            ...self.messages,
            Message.create({
              role: "user",
              content: "My name is Bob",
            }),
            Message.create({
              role: "assistant",
              content: "Hello Bob!",
            }),
          ],
        })

        this.update({ promptPreview })
      } catch (e: any) {
        console.log(e.message)
        return e.message
      }
    },
  }))
