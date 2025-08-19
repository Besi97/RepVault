"use client"

import {useCreateEmptyWorkoutMutation, useWorkoutsQuery} from "repvault-api-client";
import {Button, Spinner, Typography} from "@material-tailwind/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import CreateWorkoutDialog from "@/app/workouts/components/CreateWorkoutDialog";
import WorkoutCard from "@/app/workouts/components/WorkoutCard";

const WorkoutsPage = () => {
  const {isPending, data} = useWorkoutsQuery();
  const {mutate: createNewWorkout, isPending: isCreateNewWorkoutPending} = useCreateEmptyWorkoutMutation();
  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);
  const {push} = useRouter();

  return (<div>
    <div className="flex justify-between mb-4">
      <Typography variant="h4">Workouts</Typography>
      <Button
        variant="outlined"
        ripple={false}
        onClick={() => setIsNewWorkoutDialogOpen(true)}
      >
        New Workout
      </Button>
    </div>
    {isPending
      ? <Spinner className="h-8 w-8 mx-auto"/>
      : data?.workouts.length === 0
        ? <Typography className="text-center text-blue-gray-500">No workouts</Typography>
        : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.workouts.map((workout) => <WorkoutCard key={workout.id} workout={workout}/>)}
        </div>)}
    <CreateWorkoutDialog
      open={isNewWorkoutDialogOpen}
      handler={setIsNewWorkoutDialogOpen}
      isCreatePending={isCreateNewWorkoutPending}
      createWorkoutCallback={(newWorkoutName) => createNewWorkout(
        {
          name: newWorkoutName,
        },
        {
          onSuccess: (data) => push("/workouts/" + data.createEmptyWorkout.id),
        },
      )}
    />
  </div>);
}

export default WorkoutsPage;
