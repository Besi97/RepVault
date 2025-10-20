import {Input, InputProps} from "@material-tailwind/react";
import {FunctionComponent} from "react";
import {useField} from "formik";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";

interface Props extends InputProps {
  label: string;
  name: string;
  required?: boolean;
  inputMode?: "numeric" | "decimal";
}

const NumericField: FunctionComponent<Props> = ({
  label,
  name,
  required,
  inputMode = "numeric",
  ...props
}) => {
  const [field, {touched, error}] = useField<number | undefined>(name);

  return <FormFieldWrapper error={touched ? error : undefined} required={required}>
    <Input
      {...props}
      {...field}
      type="number"
      inputMode={inputMode}
      label={label}
      error={touched && !!error}
    />
  </FormFieldWrapper>
}

export default NumericField;
