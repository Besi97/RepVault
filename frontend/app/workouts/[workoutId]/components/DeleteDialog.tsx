import {Button, Dialog, DialogBody, DialogFooter, DialogHeader} from "@material-tailwind/react";
import {ComponentProps, FunctionComponent} from "react";

interface Props {
  open: ComponentProps<typeof Dialog>['open'];
  handler: ComponentProps<typeof Dialog>['handler'];
  description: string;
  isDeletePending: boolean;
  deleteCallback: () => void;
}

const DeleteDialog: FunctionComponent<Props> = ({
  open,
  handler,
  description,
  isDeletePending,
  deleteCallback,
}) => {
  return <Dialog
    open={open}
    handler={handler}
  >
    <DialogHeader>{`Delete ${description}`}</DialogHeader>
    <DialogBody>
      {`Are you sure you want to delete ${description}?`}
    </DialogBody>
    <DialogFooter>
      <Button
        className="mr-2"
        ripple={false}
        variant="outlined"
        onClick={() => handler(false)}
      >
        Cancel
      </Button>
      <Button
        color="red"
        ripple={false}
        loading={isDeletePending}
        onClick={deleteCallback}
      >
        Delete
      </Button>
    </DialogFooter>
  </Dialog>
}

export default DeleteDialog;
