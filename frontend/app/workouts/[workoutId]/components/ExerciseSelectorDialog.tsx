import {Dialog, DialogBody, DialogHeader, Input, Typography} from "@material-tailwind/react";
import {ComponentProps, FunctionComponent, useState} from "react";
import {useExercisesQuery} from "repvault-api-client";

interface Props {
  open: ComponentProps<typeof Dialog>['open'];
  handler: ComponentProps<typeof Dialog>['handler'];
  selectCallback: (id: string) => void;
}

const ExerciseSelectorDialog: FunctionComponent<Props> = ({
  open,
  handler,
  selectCallback,
}) => {
  const [nameSearch, setNameSearch] = useState<string>("")
  const {data} = useExercisesQuery({filters: {name: nameSearch}, pagination: {count: 10}})

  return <Dialog open={open} handler={handler}>
    <DialogBody>
      <DialogHeader>
        Select Exercise
      </DialogHeader>
      <DialogBody>
        <Input
          label="Search"
          type="text"
          value={nameSearch}
          onChange={(event) => setNameSearch(event.target.value)}
        />
        <ul className="mt-4">
          {data?.exercises.data.map((exercise) =>
            <li
              key={exercise.id}
              className="hover:shadow rounded-md"
              onClick={() => {
                selectCallback(exercise.id)
                handler(false)
              }}
            >
              <Typography className="p-2">{exercise.name}</Typography>
            </li>
          )}
        </ul>
      </DialogBody>
    </DialogBody>
  </Dialog>
}

export default ExerciseSelectorDialog;
