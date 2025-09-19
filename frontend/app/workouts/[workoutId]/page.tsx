"use client"

import {FunctionComponent, use, useState} from "react";
import {useAddEmptyRoutineMutation, useDeleteWorkoutMutation, useWorkoutsQuery} from "repvault-api-client";
import {Button, Spinner, Typography} from "@material-tailwind/react";
import {useRouter} from "next/navigation";
import WorkoutDetails from "@/app/workouts/[workoutId]/components/WorkoutDetails";
import DeleteDialog from "@/app/workouts/[workoutId]/components/DeleteDialog";

interface Props {
  params: Promise<{ workoutId: string }>;
}

const WorkoutDetailsPage: FunctionComponent<Props> = ({params}) => {
  const {workoutId} = use(params);
  const {isPending, data, refetch} = useWorkoutsQuery({id: workoutId});
  const workout = data?.workouts[0];
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {mutate: deleteWorkout, isPending: isDeleteWorkoutPending} = useDeleteWorkoutMutation();
  const {push} = useRouter();
  const {mutate: addEmptyRoutine, isPending: isAddEmptyRoutingPending} = useAddEmptyRoutineMutation();

  return isPending ? <Spinner className="h-8 w-8 mx-auto"/> :
    <div>
      <div className="flex justify-between mb-4 items-center">
        <Typography variant="h4">{workout?.name}</Typography>
        <div className="flex gap-4">
          <Button
            variant="outlined"
            ripple={false}
            disabled={isAddEmptyRoutingPending}
            loading={isAddEmptyRoutingPending}
            onClick={() => {
              addEmptyRoutine(
                {
                  workoutId,
                },
                {
                  onSuccess: () => refetch(),
                },
              )
            }}
          >
            Add routine
          </Button>
          <Button
            color="red"
            ripple={false}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      {workout && <WorkoutDetails workout={workout} refetch={refetch}/>}
      {workout && <DeleteDialog
          open={isDeleteDialogOpen}
          handler={setIsDeleteDialogOpen}
          description={`workout '${workout.name}'`}
          isDeletePending={isDeleteWorkoutPending}
          deleteCallback={() => deleteWorkout(
            {
              id: workoutId,
            },
            {
              onSuccess: () => push("/workouts"),
            },
          )}
      />}
    </div>;
};

export default WorkoutDetailsPage;
