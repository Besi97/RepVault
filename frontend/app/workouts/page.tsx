"use client"

import {useCreateEmptyWorkoutMutation, useWorkoutsQuery, WorkoutsQuery} from "repvault-api-client";

import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody, DialogFooter,
  DialogHeader,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import {useCallback, useState} from "react";
import FormFieldWrapper from "@/app/components/Form/FormFieldWrapper";
import {useRouter} from "next/navigation";

const exerciseListFromWorkout = (workout?: WorkoutsQuery['workouts'][any]): string | undefined => {
  const exercises = workout?.setGroups.flatMap((setGroup) => setGroup.sets).map((set) => set.exercise.name);
  return exercises === undefined ? undefined : exercises.length === 0 ? "No exercises" : `Exercises: ${exercises.join(
    ", ")}`
}

const WorkoutsPage = () => {
  const {isPending, data} = useWorkoutsQuery();
  const {mutate: createNewWorkout, isPending: isCreateNewWorkoutPending} = useCreateEmptyWorkoutMutation();
  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const {push} = useRouter();

  const createNewWorkoutAndNavigate = useCallback(() => {
    createNewWorkout(
      {
        name: newWorkoutName,
      },
      {
        onSuccess: (data) => push("/workouts/" + data.createEmptyWorkout.id),
      },
    );
  }, [createNewWorkout, newWorkoutName, push]);

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
          {data?.workouts.map((workout) => <a key={workout.id} href={`workouts/${workout.id}`}>
            <Card className="bg-teal-50">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">{workout.name}</Typography>
                <Typography>
                  {exerciseListFromWorkout(workout)}
                </Typography>
              </CardBody>
            </Card>
          </a>)}
        </div>)}
    <Dialog
      open={isNewWorkoutDialogOpen}
      handler={setIsNewWorkoutDialogOpen}
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
              if (event.key === 'Enter' && !isCreateNewWorkoutPending && newWorkoutName.length > 0) {
                createNewWorkoutAndNavigate();
              }
            }}
          ></Input>
        </FormFieldWrapper>
      </DialogBody>
      <DialogFooter>
        <Button
          ripple={false}
          loading={isCreateNewWorkoutPending}
          disabled={!newWorkoutName.length || isCreateNewWorkoutPending}
          onClick={createNewWorkoutAndNavigate}
        >
          Create Workout
        </Button>
      </DialogFooter>
    </Dialog>
  </div>);
}

export default WorkoutsPage;
