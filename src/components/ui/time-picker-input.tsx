
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: "hours" | "minutes" | "seconds"
  value?: Date
  onChange?: (date: Date | undefined) => void
  onRightFocus?: () => void
  onLeftFocus?: () => void
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      className,
      type = "number",
      value,
      onChange,
      picker,
      onRightFocus,
      onLeftFocus,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>("")

    React.useEffect(() => {
      if (!value) {
        setInternalValue("")
        return
      }

      switch (picker) {
        case "hours":
          setInternalValue(value.getHours().toString().padStart(2, "0"))
          break
        case "minutes":
          setInternalValue(value.getMinutes().toString().padStart(2, "0"))
          break
        case "seconds":
          setInternalValue(value.getSeconds().toString().padStart(2, "0"))
          break
      }
    }, [picker, value])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowRight" && onRightFocus) {
        e.preventDefault()
        onRightFocus()
      } else if (e.key === "ArrowLeft" && onLeftFocus) {
        e.preventDefault()
        onLeftFocus()
      } else if (e.key === "Tab") {
        return
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let targetValue = e.target.value
      targetValue = targetValue.replace(/\D/g, "")

      let numValue = parseInt(targetValue, 10)
      let newValue: Date | undefined
      const defaultValue = new Date()
      defaultValue.setHours(0, 0, 0, 0)

      switch (picker) {
        case "hours":
          if (targetValue === "") {
            setInternalValue("")
            onChange?.(undefined)
            return
          }

          if (isNaN(numValue)) numValue = 0
          if (numValue > 23) numValue = 23
          targetValue = numValue.toString().padStart(2, "0")

          if (targetValue.length > 2) {
            targetValue = targetValue.substring(targetValue.length - 2)
          }

          newValue = value ?? defaultValue
          newValue.setHours(numValue)
          onChange?.(new Date(newValue))

          break
        case "minutes":
          if (targetValue === "") {
            setInternalValue("")
            onChange?.(undefined)
            return
          }

          if (isNaN(numValue)) numValue = 0
          if (numValue > 59) numValue = 59
          targetValue = numValue.toString().padStart(2, "0")

          if (targetValue.length > 2) {
            targetValue = targetValue.substring(targetValue.length - 2)
          }

          newValue = value ?? defaultValue
          newValue.setMinutes(numValue)
          onChange?.(new Date(newValue))

          break
        case "seconds":
          if (targetValue === "") {
            setInternalValue("")
            onChange?.(undefined)
            return
          }

          if (isNaN(numValue)) numValue = 0
          if (numValue > 59) numValue = 59
          targetValue = numValue.toString().padStart(2, "0")

          if (targetValue.length > 2) {
            targetValue = targetValue.substring(targetValue.length - 2)
          }

          newValue = value ?? defaultValue
          newValue.setSeconds(numValue)
          onChange?.(new Date(newValue))

          break
      }

      setInternalValue(targetValue)
    }

    return (
      <Input
        ref={ref}
        type={type}
        inputMode="numeric"
        className={cn("h-10 w-full rounded-md text-center", className)}
        value={internalValue}
        onChange={handleChange}
        max={picker === "hours" ? 23 : 59}
        min={0}
        maxLength={2}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)

TimePickerInput.displayName = "TimePickerInput"

export { TimePickerInput }
