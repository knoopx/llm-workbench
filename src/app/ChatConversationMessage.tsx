import Markdown from "react-markdown"
import { cn } from "@/lib/utils"
import { TbPrompt } from "react-icons/tb"
import { cloneElement, useEffect, useRef } from "react"
import { observer } from "mobx-react"

import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import remarkEmoji from "remark-emoji"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"

import "katex/dist/katex.min.css"
import "highlight.js/styles/github-dark.css"

export const Message = observer(({ message }) => {
  const ref = useRef(null)

  const { role, content, isEmpty, chat } = message

  useEffect(() => {
    const scrollContainer = ref.current?.closest(
      "[data-radix-scroll-area-viewport]",
    )
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      // behavior: "smooth",
    })
  }, [content])

  return (
    <div ref={ref} className="flex flex-auto space-x-4 px-8 py-4">
      <div className="flex flex-col">
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center -my-1",
            {
              "dark:bg-white dark:text-black bg-black text-white font-extrabold ":
                role === "assistant",
              "text-muted-foreground": role === "user",
              "animate-pulse": role === "assistant" && chat.isRunning,
            },
          )}
        >
          {role !== "system" &&
            (role == "user" ? (
              <TbPrompt size="1.5em" />
            ) : (
              role[0].toUpperCase()
            ))}
        </span>
      </div>
      <div className="flex-auto">
        {isEmpty ? (
          <div
            className={cn("min-w-[65ch]", {
              "animate-pulse": message.chat.isRunning,
            })}
          >
            ...
          </div>
        ) : (
          <Markdown
            remarkPlugins={[remarkEmoji, remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            className={cn("prose dark:prose-invert min-w-[65ch]", {
              "text-muted-foreground": role === "user",
              "italic text-muted-foreground": role === "system",
            })}
            components={{
              pre({ node, children, ...rest }) {
                return (
                  <pre {...rest} className="not-prose text-xs">
                    {cloneElement(children, {
                      className: cn(
                        "rounded-md p-4 !bg-gray-900",
                        children.props.className,
                      ),
                    })}
                  </pre>
                )
              },
            }}
          >
            {content}
          </Markdown>
        )}
      </div>
    </div>
  )
})
