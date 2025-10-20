import {ComponentProps, FunctionComponent} from "react";
import {Button, Dialog, DialogBody, DialogHeader, Option} from "@material-tailwind/react";
import {Form, Formik} from "formik";
import Select from "@/app/components/Form/Select";
import {SetInput, SetType, WeightUnit} from "repvault-api-client";
import NumericField from "@/app/components/Form/NumericField";

interface Props {
  open: ComponentProps<typeof Dialog>['open'];
  setId?: string;
  set: SetInput;
  onSubmit: (set: SetInput, setId: string | undefined) => void;
  onCancel: (setId: string | undefined) => void;
}

const defaultValues: Partial<SetInput> = {
  setType: SetType.Main,
  weightUnit: WeightUnit.Kg,
}

const SetEditorDialog: FunctionComponent<Props> = ({
  open,
  setId,
  set,
  onSubmit,
  onCancel
}) => {
  return <Dialog open={open} handler={() => {}}>
    <DialogHeader>
      {setId ? "Edit" : "Create"} Set
    </DialogHeader>
    <DialogBody>
      <Formik
        initialValues={{
          ...defaultValues,
          ...set,
        }}
        onSubmit={(values) => onSubmit(values, setId)}
      >
        {({isSubmitting, isValid}) =>
          <Form>
            <Select label="Set Type" name="setType">
              {Object.entries(SetType).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
            </Select>
            <NumericField label="Weight" name="weight" inputMode="decimal"/>
            <Select label="Weight Unit" name="weightUnit">
              {Object.entries(WeightUnit).map(([key, value]) => <Option key={value} value={value}>{key}</Option>)}
            </Select>
            <NumericField label="Repetitions" name="repetitions"/>
            <NumericField label="Rest After" name="restAfter"/>
            <div className="flex justify-end w-full gap-2">
              <Button loading={isSubmitting} variant="outlined" onClick={() => onCancel(setId)} ripple={false}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting} ripple={false}>
                Save
              </Button>
            </div>
          </Form>
        }
      </Formik>
    </DialogBody>
  </Dialog>
}

export default SetEditorDialog;
