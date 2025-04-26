import {FunctionComponent, ReactNode} from "react";
import {Select as MaterialSelect} from "@material-tailwind/react";
import {useField} from "formik";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";

interface Props {
  label: string;
  name: string;
  children: ReactNode;
  required?: boolean;
}

const Select: FunctionComponent<Props> = ({label, name, children, required}) => {
  const [field, {touched, error}, { setValue, setTouched }] = useField(name);

  return (
    <FormFieldWrapper error={touched ? error : undefined} required={required}>
      <MaterialSelect
        {...field}
        label={label}
        error={touched && !!error}
        onChange={setValue}
        onBlur={() => setTouched(true)}
      >
        {children}
      </MaterialSelect>
    </FormFieldWrapper>
  )
}

export default Select;
