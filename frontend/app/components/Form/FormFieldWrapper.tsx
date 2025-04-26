import React, {FunctionComponent, ReactNode} from "react";
import FieldError from "@/app/components/Form/FieldError";
import RequiredLabel from "@/app/components/Form/RequiredLabel";

interface Props {
  children: ReactNode;
  error?: string;
  required?: boolean;
}

const FormFieldWrapper: FunctionComponent<Props> = ({children, error, required}) => {
  const hasSubText = error || required;

  return (
    <div className={`my-2 ${hasSubText ? "" : "pb-[21px]"}`}>
      {children}
      {error
        ? <FieldError>{error}</FieldError>
        : required
          ? <RequiredLabel/>
          : undefined
      }
    </div>
  );
}

export default FormFieldWrapper;
