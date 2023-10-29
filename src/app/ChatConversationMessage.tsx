import Markdown from "react-markdown"
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { cn } from "@/lib/utils"
import { TbPrompt } from "react-icons/tb"
// import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cloneElement, useEffect, useRef } from "react"
import { observer } from "mobx-react"

import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github-dark.css"
import { useTheme } from "@/components/ThemeProvider"

export const Message = observer(({ role, content }) => {
  const ref = useRef(null)
  const { theme } = useTheme()
  useEffect(() => {
    const scrollContainer = ref.current?.closest(
      "[data-radix-scroll-area-viewport]",
    )
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    })
  }, [content])

  return (
    <div ref={ref} className="flex space-x-4 px-8 py-4">
      <div className="flex flex-col">
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center -my-1",
            {
              "dark:bg-white dark:text-black bg-black text-white font-extrabold ":
                role === "assistant",
              "text-muted-foreground": role === "user",
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

        {/* <div className="font-medium w-32">{role}</div>
                <div className="text-muted text-xs">{date.toLocaleTimeString()}</div> */}
      </div>
      <div className="flex-auto">
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
          className={cn("prose dark:prose-invert", {
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
      </div>
    </div>
  )
})
