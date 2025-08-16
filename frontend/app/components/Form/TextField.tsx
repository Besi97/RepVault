import {FunctionComponent, useState} from "react";
import {useField} from "formik";
import {Input, InputProps} from "@material-tailwind/react";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";

interface Props extends InputProps {
  label: string;
  name: string;
  /**
   * If the input is a list, input string will be split at commas, and the field will provide an array
   */
  isList?: boolean;
  required?: boolean;
}

const TextField: FunctionComponent<Props> = ({label, name, isList, required, ...props}) => {
  const [field, {touched, error}, {setValue}] = useField<string | string[] | undefined>(name);
  const [displayValue, setDisplayValue] = useState<string>(
    !field?.value?.length ? "" : typeof field.value === "string" ? field.value : field.value.join(", ")
  );

  return (
    <FormFieldWrapper error={touched ? error : undefined} required={required}>
      <Input
        {...props}
        {...field}
        label={label}
        error={touched && !!error}
        value={displayValue}
        onChange={(event) => {
          field.onChange(event);
          const value = event.target.value;
          setDisplayValue(value);
          if (isList) {
            setValue(
              value.split(",")
                .map((item) => item.trim())
                .filter((item) => !!item)
            )
          }
        }}
      />
    </FormFieldWrapper>
  )
}

export default TextField;
