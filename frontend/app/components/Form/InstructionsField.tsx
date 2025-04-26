import {FunctionComponent, useState} from "react";
import {useField} from "formik";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Textarea, Typography
} from "@material-tailwind/react";
import {ChevronRightIcon, PencilIcon, PlayIcon, TrashIcon, XMarkIcon} from "@heroicons/react/24/solid";

interface Props {
  label: string;
  name: string;
  required?: boolean;
}

const InstructionsField: FunctionComponent<Props> = ({label, name, required}) => {
  const [{value}, {touched, error}, {setValue, setTouched}] = useField<string[] | undefined>(name);
  const [currentInput, setCurrentInput] = useState<string | undefined>();
  const [editedIndex, setEditedIndex] = useState<number | undefined>();

  const addOrEditElement = () => {
    if (!currentInput) {
      return;
    }

    if (editedIndex === undefined) {
      setValue([...(value ?? []), currentInput])
    } else if (value) {
      setValue([...value.slice(0, editedIndex), currentInput, ...value.slice(editedIndex + 1)])
      setEditedIndex(undefined);
    }
    setCurrentInput("")
  }

  const moveElementUp = (index: number) => {
    // first element is not allowed
    if (!value || index < 1 || index > value.length - 1) {
      return;
    }

    const previousElement = value[index - 1];
    const element = value[index];
    setValue([...value.slice(0, index - 1), element, previousElement, ...value.slice(index + 1)]);
    if (editedIndex !== undefined) {
      // we assume that the edited element is the one being moved, since other elements should be disabled
      setEditedIndex(editedIndex - 1);
    }
  }

  const moveElementDown = (index: number) => {
    // last element is not allowed
    if (!value || index < 0 || index > value.length - 2) {
      return;
    }

    const element = value[index];
    const nextElement = value[index + 1];
    setValue([...value.slice(0, index), nextElement, element, ...value.slice(index + 2)]);
    if (editedIndex !== undefined) {
      // we assume that the edited element is the one being moved, since other elements should be disabled
      setEditedIndex(editedIndex + 1);
    }
  }

  const editElement = (index: number) => {
    if (!value || index < 0 || index > value.length - 1) {
      return;
    }

    if (editedIndex !== undefined) {
      setCurrentInput("");
      setEditedIndex(undefined);
      return;
    }

    setEditedIndex(index);
    setCurrentInput(value[index]);
  }

  const removeElement = (index: number) => {
    if (!value || index < 0 || index > value.length - 1) {
      return;
    }

    setValue([...value.slice(0, index), ...value.slice(index + 1)]);
    if (editedIndex !== undefined) {
      // we assume that the edited element is the one being removed, since other elements should be disabled
      setEditedIndex(undefined);
      setCurrentInput("");
    }
  }

  // This component defines its own error handling
  return (
    <FormFieldWrapper error={touched ? error : undefined} required={required}>
      <div className="relative flex w-full">
        <Textarea
          label={label}
          error={touched && !!error}
          className="pr-20"
          value={currentInput}
          onChange={({target}) => setCurrentInput(target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addOrEditElement();
              event.preventDefault();
            }
          }}
        />
        <Button
          size="sm"
          className="!absolute right-2 top-2"
          disabled={!currentInput?.length}
          onClick={addOrEditElement}
        >
          {editedIndex === undefined ? "Add" : "Save"}
        </Button>
      </div>
      {!value?.length ? undefined : <List>
        {value.map((item, index) => (
          <ListItem
            key={`${index}-${item}`}
            ripple={false}
            className="py-1"
            disabled={editedIndex !== undefined && editedIndex !== index}
          >
            <ListItemPrefix className="mr-1">
              <ChevronRightIcon className="size-4 text-black"/>
            </ListItemPrefix>
            <Typography className="wrap-anywhere" variant="small">
              {item}
            </Typography>
            <ListItemSuffix className="pl-2 grid grid-cols-4 gap-1 flex-none">
              {index === 0 ? undefined :
                <IconButton
                  color="black"
                  size="sm"
                  variant="outlined"
                  className="hover:bg-black group col-start-1"
                  ripple={false}
                  onClick={() => moveElementUp(index)}
                >
                  <PlayIcon className="size-full text-black -rotate-90 group-hover:text-white"/>
                </IconButton>
              }
              {index === value.length - 1 ? undefined :
                <IconButton
                  color="black"
                  size="sm"
                  variant="outlined"
                  className="hover:bg-black group col-start-2"
                  ripple={false}
                  onClick={() => moveElementDown(index)}
                >
                  <PlayIcon className="size-full text-black rotate-90 group-hover:text-white"/>
                </IconButton>
              }
              <IconButton
                color="black"
                size="sm"
                variant="outlined"
                className="hover:bg-black group col-start-3"
                ripple={false}
                onClick={() => editElement(index)}
              >
                {editedIndex === index
                  ? <XMarkIcon className="size-full text-black group-hover:text-white"/>
                  : <PencilIcon className="size-full text-black group-hover:text-white"/>
                }
              </IconButton>
              <IconButton
                color="red"
                size="sm"
                variant="outlined"
                className="hover:bg-red-500 group col-start-4"
                ripple={false}
                onClick={() => removeElement(index)}
              >
                <TrashIcon className="size-full text-red-500 group-hover:text-white"/>
              </IconButton>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>}
    </FormFieldWrapper>
  )
}

export default InstructionsField;
