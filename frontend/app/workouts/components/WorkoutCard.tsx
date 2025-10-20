import {FunctionComponent} from "react";
import {WorkoutsQuery} from "repvault-api-client";
import {Card, CardBody, Typography} from "@material-tailwind/react";

const exerciseListFromWorkout = (workout: WorkoutsQuery['workouts'][any]): string | undefined => {
  const exercises = [
    ...new Set(workout.setGroups.flatMap((setGroup) => setGroup.sets).map((set) => set.exercise.name)),
  ];
  return !exercises.length ? "No exercises" : `Exercises: ${exercises.join(", ")}`
}

interface Props {
  workout: WorkoutsQuery['workouts'][any];
}

const WorkoutCard: FunctionComponent<Props> = ({workout}) => {
  return <a key={workout.id} href={`workouts/${workout.id}`}>
    <Card className="bg-teal-50">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">{workout.name}</Typography>
        <Typography>
          {exerciseListFromWorkout(workout)}
        </Typography>
      </CardBody>
    </Card>
  </a>;
}

export default WorkoutCard;
