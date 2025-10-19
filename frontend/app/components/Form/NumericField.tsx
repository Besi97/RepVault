import {Input, InputProps} from "@material-tailwind/react";
import {FunctionComponent} from "react";
import {useField} from "formik";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";

interface Props extends InputProps {
  label: string;
  name: string;
  required?: boolean;
  inputMode: "numeric";
}

const NumericField: FunctionComponent<Props> = ({label, name, required, ...props}) => {
  const [field, {touched, error}, {setValue}] = useField<number | undefined>(name);

  return <FormFieldWrapper error={touched ? error : undefined} required={required}>
    <Input
      {...props}
      {...field}
      inputMode="numeric"
      label={label}
      error={touched && !!error}
      onChange={(event) => {
        field.onChange(event);
        const value = event.target.value;
        if (value) {
          setValue(parseInt(value));
        }
      }}
    />
  </FormFieldWrapper>
}

export default NumericField;
