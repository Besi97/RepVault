import React, {useState} from 'react';
import {
  Select,
  Checkbox,
  List,
  ListItem,
} from "@material-tailwind/react";
import {useField} from "formik";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  name: string;
  options: MultiSelectOption[];
  required?: boolean;
}

const MultiSelect: React.FunctionComponent<MultiSelectProps> = ({label, name, options, required}) => {
  const [
    field,
    {touched, error, value: selectedValues},
    {setValue: setSelectedValues, setTouched}
  ] = useField<string[]>(name);
  const [displayValue, setDisplayValue] = useState<string | undefined>();

  const handleSelect = (newValue: string) => {
    const newValues = selectedValues?.includes(newValue)
      ? selectedValues.filter((v) => v !== newValue)
      : [...(selectedValues ?? []), newValue];

    setSelectedValues(newValues);
    setDisplayValue(newValues?.length > 0
      ? `${newValues.length} selected`
      : undefined);
  };
  
  return (
    <FormFieldWrapper error={touched ? error : undefined} required={required}>
      <Select
        label={label}
        value={displayValue}
        error={touched && !!error}
        onBlur={() => setTouched(true)}
      >
        <List className="p-0 gap-0">
          {options.map(({value, label: optionLabel}) => (
            <ListItem key={value} ripple={false} className="p-0">
              <Checkbox
                id={`${field.name}-${value}`}
                label={optionLabel}
                checked={selectedValues?.includes(value)}
                onChange={() => handleSelect(value)}
                containerProps={{className: "p-2"}}
                labelProps={{className: "w-full py-2 text-sm group-hover:text-blue-gray-900"}}
                ref={(ref) => {
                  if (ref) {
                    ref.className = "inline-flex items-center w-full group"
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Select>
    </FormFieldWrapper>
  );
};

export default MultiSelect;