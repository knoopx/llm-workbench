import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useEffect, PropsWithoutRef } from "react"
import { observer } from "mobx-react"

export const AutoTextarea = observer(
  ({
    className,
    value,
    onChange,
    maxRows = 8,
    ...rest
  }: PropsWithoutRef<HTMLTextAreaElement> & {
    maxRows?: number
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  }) => {
    const ref = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      if (!ref.current) return
      ref.current.style.height = "0px"
      const { scrollHeight } = ref.current
      ref.current.style.height = `min(${
        getComputedStyle(ref.current).lineHeight
      } * ${maxRows + 1}, ${scrollHeight}px)`
    }, [value])

    return (
      <Textarea
        ref={ref}
        className={cn(
          "font-mono text-xs whitespace-pre resize-none",
          className,
        )}
        value={value}
        onChange={onChange}
        {...rest}
      />
    )
  },
)
