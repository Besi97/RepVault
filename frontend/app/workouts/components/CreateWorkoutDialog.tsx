import {ComponentProps, FunctionComponent, useState} from "react";
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input} from "@material-tailwind/react";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";

interface Props {
  open: ComponentProps<typeof Dialog>['open'];
  handler: ComponentProps<typeof Dialog>['handler'];
  isCreatePending: boolean;
  createWorkoutCallback: (name: string) => void;
}

const CreateWorkoutDialog: FunctionComponent<Props> = ({
  open,
  handler,
  isCreatePending,
  createWorkoutCallback,
}) => {
  const [newWorkoutName, setNewWorkoutName] = useState("");

  return <Dialog
    open={open}
    handler={handler}
    size="sm"
  >
    <DialogHeader>Create New Workout</DialogHeader>
    <DialogBody>
      <FormFieldWrapper required>
        <Input
          label="Workout Name"
          type="text"
          value={newWorkoutName}
          onChange={(event) => setNewWorkoutName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !isCreatePending && newWorkoutName.length > 0) {
              createWorkoutCallback(newWorkoutName);
            }
          }}
        ></Input>
      </FormFieldWrapper>
    </DialogBody>
    <DialogFooter>
      <Button
        ripple={false}
        loading={isCreatePending}
        disabled={!newWorkoutName.length || isCreatePending}
        onClick={() => createWorkoutCallback(newWorkoutName)}
      >
        Create Workout
      </Button>
    </DialogFooter>
  </Dialog>
}

export default CreateWorkoutDialog;
