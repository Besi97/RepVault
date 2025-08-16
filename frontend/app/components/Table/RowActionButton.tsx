import {ReactNode, useState} from "react";
import {colors} from "@material-tailwind/react/types/generic";
import {IconButton, Spinner} from "@material-tailwind/react";

type Subset<T, U extends T> = U;

export interface RowAction<T> {
  icon: ReactNode,
  link?: string | ((row: T) => string),
  /** Action to perform on click. Caller should call the `finalizeAction` function once the action is finished */
  onClick?: (row: T, finalizeAction: () => void) => void,
  color?: Subset<colors, "blue-gray" | "red">
}

interface Props<T> extends RowAction<T> {
  row: T,
}

const actionButtonClassName = (color: RowAction<never>["color"]) => {
  const bgHover = `hover:bg-${color === "red" ? "red-500" : "black"}`
  const text = `text-${color === "red" ? "red-500" : "black"}`
  return `${bgHover} ${text} hover:text-white`
}

const RowActionButton = <T, >({icon, link, onClick, color, row}: Props<T>): ReactNode => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const button = (
    <IconButton
      color={color ?? "black"}
      size="sm"
      variant="outlined"
      onClick={() => {
        if (onClick) {
          setIsSubmitting(true);
          onClick(row, () => setIsSubmitting(false));
        }
      }}
      className={actionButtonClassName(color)}
      ripple={false}
      disabled={isSubmitting}
    >
      {isSubmitting ? <Spinner className="w-full" color={color ?? "blue-gray"}/> : icon}
    </IconButton>
  )

  return (link ? <a href={typeof link === "string" ? link : link(row)}>{button}</a> : button)
}

export default RowActionButton;
