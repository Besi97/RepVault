import {FunctionComponent} from "react";
import {Button, Option} from "@material-tailwind/react";
import {Form, Formik} from "formik";
import {Category, Equipment, ExerciseInput, Force, Level, Mechanic, Muscle} from "repvault-api-client";
import TextField from "@/app/components/Form/TextField";
import Select from "@/app/components/Form/Select";
import MultiSelect from "@/app/components/Form/MultiSelect";
import InstructionsField from "@/app/components/Form/InstructionsField";

interface Props {
  /**
   * ID of the exercise to edit. If not provided, a new exercise will be created.
   */
  exerciseId?: string;
  onSubmit: (exercise: ExerciseInput, finalizeSubmit?: () => void) => void;
}

const validate = (values: Partial<ExerciseInput>): Partial<Record<keyof ExerciseInput, string>> => {
  const errors: Partial<Record<keyof ExerciseInput, string>> = {};
  if (!values?.name?.length) {
    errors.name = "Name is required";
  }
  if (!values?.primaryMuscles?.length) {
    errors.primaryMuscles = "Selecting at least one primary muscle is required";
  }
  if (!values?.level?.length) {
    errors.level = "Selecting the level is required";
  }
  if (!values?.category?.length) {
    errors.category = "Selecting the category is required";
  }
  if (!values?.instructions?.length) {
    errors.instructions = "At least one instruction is required";
  }
  return errors;
}

const isValid = (values: Partial<ExerciseInput>): values is ExerciseInput =>
  Object.keys(validate(values)).length === 0;

const AddEditForm: FunctionComponent<Props> = ({exerciseId, onSubmit}) => {
  return (<Formik
      initialValues={{}}
      isInitialValid={false}
      validate={validate}
      onSubmit={(values: Partial<ExerciseInput>, {setSubmitting}) => {
        if (isValid(values)) {
          onSubmit(values, () => setSubmitting(false));
        }
      }}
    >
      {({isSubmitting, isValid}) => (
        <Form>
          <TextField label="Name" name="name" required/>
          <TextField label="Aliases" name="aliases" isList placeholder="Comma separated list of aliases"/>
          <MultiSelect
            label="Primary Muscles"
            name="primaryMuscles"
            options={Object.entries(Muscle).map(([key, value]) => ({label: key, value}))}
            required
          />
          <MultiSelect
            label="Secondary Muscles"
            name="secondaryMuscles"
            options={Object.entries(Muscle).map(([key, value]) => ({label: key, value}))}
          />
          <Select label="Force" name="force">
            {Object.entries(Force).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
          </Select>
          <Select label="Level" name="level" required>
            {Object.entries(Level).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
          </Select>
          <Select label="Mechanic" name="mechanic">
            {Object.entries(Mechanic).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
          </Select>
          <Select label="Equipment" name="equipment">
            {Object.entries(Equipment).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
          </Select>
          <Select label="Category" name="category" required>
            {Object.entries(Category).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
          </Select>
          <TextField label="Description" name="description"/>
          <InstructionsField label="Instructions" name="instructions" required/>
          <InstructionsField label="Tips" name="tips"/>
          <div className="flex justify-end w-full">
            <Button type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting}>
              {exerciseId === undefined ? "Create" : "Save"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddEditForm;
