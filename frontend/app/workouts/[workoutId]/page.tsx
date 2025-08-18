"use client"

import {ComponentProps, FunctionComponent, use, useState} from "react";
import {useDeleteWorkoutMutation, useWorkoutsQuery} from "repvault-api-client";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import Table from "@/app/components/Table/Table";
import {useRouter} from "next/navigation";

interface Props {
  params: Promise<{ workoutId: string }>;
}

const columns: ComponentProps<typeof Table>['columns'] = [
  {
    header: "Exercise",
    accessor: (row) => row.exercise.name,
  },
  {
    header: "Type",
    accessor: (row) => row.setType,
  },
  {
    header: "Weight",
    accessor: (row) => `${row.weight} ${row.weightUnit}`,
  },
  {
    header: "Repetitions",
    accessor: (row) => row.repetitions,
  },
  {
    header: "Rest",
    accessor: (row) => `${row.restAfter} sec`,
  },
]

const WorkoutDetails: FunctionComponent<Props> = ({params}) => {
  const {workoutId} = use(params);
  const {isPending, data} = useWorkoutsQuery({id: workoutId});
  const workout = data?.workouts[0];
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {mutate: deleteWorkout, isPending: isDeleteWorkoutPending} = useDeleteWorkoutMutation();
  const {push} = useRouter();

  return isPending ? <Spinner className="h-8 w-8 mx-auto"/> :
    <div>
      <div className="flex justify-between mb-4">
        <Typography variant="h4">{workout?.name}</Typography>
        <Button
          color="red"
          ripple={false}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>
      {workout?.setGroups.map((setGroup, index) => (
        <Card className="mb-4 bg-teal-50" key={setGroup.id}>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">Routine #{index + 1}</Typography>
            <Table
              data={setGroup.sets}
              columns={columns}
              rowKey={(row) => `${setGroup.id}/${row.id}`}/>
          </CardBody>
        </Card>
      ))}
      <Dialog
        open={isDeleteDialogOpen}
        handler={setIsDeleteDialogOpen}
      >
        <DialogHeader>Delete Workout</DialogHeader>
        <DialogBody>
          {`Are you sure you want to delete workout '${workout?.name}'?`}
        </DialogBody>
        <DialogFooter>
          <Button
            className="mr-2"
            ripple={false}
            variant="outlined"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            ripple={false}
            loading={isDeleteWorkoutPending}
            onClick={() => {
              deleteWorkout(
                {
                  id: workoutId
                },
                {
                  onSuccess: () => push("/workouts")
                }
              )
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>;
};

export default WorkoutDetails;
