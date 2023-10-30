import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useState, useEffect } from "react"

export const AutoTextarea = ({
  className,
  onChange,
  maxRows = 8,
  ...rest
}: {
  className?: string
  maxRows?: number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => {
  const ref = useRef(null)
  const [currentValue, setCurrentValue] = useState("") // you can manage data with it

  useEffect(() => {
    ref.current.style.height = "0px"
    const scrollHeight = ref.current.scrollHeight
    ref.current.style.height = `min(${
      getComputedStyle(ref.current).lineHeight
    } * ${maxRows + 1}, ${scrollHeight}px)`
  }, [currentValue])

  return (
    <Textarea
      ref={ref}
      className={cn("resize-none", className)}
      value={currentValue}
      onChange={(e) => {
        setCurrentValue(e.target.value)
        onChange(e)
      }}
      {...rest}
    />
  )
}

export default AutoTextarea
