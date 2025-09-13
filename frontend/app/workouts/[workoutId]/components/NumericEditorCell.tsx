import {FunctionComponent, SetStateAction} from "react";
import {IconButton, Input} from "@material-tailwind/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";

interface Props {
  value?: number;
  setValue: (valueOrSetter: SetStateAction<number | undefined>) => void;
  /** The amount by which the plus and minus buttons increase or decrease the value. Defaults to 1. */
  increment?: number;
}

const NumericEditorCell: FunctionComponent<Props> = ({
  value,
  setValue,
  increment = 1
}) => <div className="flex flex-row gap-1">
    <IconButton
      className="text-black"
      color="black"
      size="sm"
      variant="outlined"
      ripple={false}
      onClick={() => setValue((prevState) => !prevState || prevState <= 0 ? 0 : prevState - increment)}
    >
      <MinusIcon className="size-full"/>
    </IconButton>
    <Input
      inputMode="numeric"
      size="md"
      color="black"
      value={value}
      onChange={(event) => setValue(event.target.value ? parseInt(event.target.value) : undefined)}
      containerProps={{
        className: "!min-w-0 !h-8 !w-12.5",
      }}
    />
    <IconButton
      className="text-black"
      color="black"
      size="sm"
      variant="outlined"
      ripple={false}
      onClick={() => setValue((prevState) => {
        console.log("previous", prevState);
        console.log("setting", prevState ? prevState + increment : increment);
        return prevState ? prevState + increment : increment
      })}
    >
      <PlusIcon className="size-full"/>
    </IconButton>
  </div>

export default NumericEditorCell;
