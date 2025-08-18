"use client"

import {useWorkoutsQuery, WorkoutsQuery} from "repvault-api-client";

import {Card, CardBody, Spinner, Typography} from "@material-tailwind/react";

const exerciseListFromWorkout = (workout?: WorkoutsQuery['workouts'][any]): string | undefined => {
  const exercises = workout?.setGroups.flatMap((setGroup) => setGroup.sets).map((set) => set.exercise.name);
  return exercises === undefined
    ? undefined
    : exercises.length === 0
      ? "No exercises"
      : `Exercises: ${exercises.join(", ")}`
}

const WorkoutsPage = () => {
  const {isPending, data} = useWorkoutsQuery();

  return (<div>
    <Typography variant="h4" className="mb-4">Workouts</Typography>
    {isPending ? <Spinner className="h-8 w-8 mx-auto"/> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    )}
  </div>);
}

export default WorkoutsPage;
