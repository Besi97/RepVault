import {FunctionComponent, useState} from "react";
import {
  useDeleteRoutineMutation, useWorkoutsQuery,
  WorkoutsQuery,
  useAddNewSetMutation,
} from "repvault-api-client";
import {Button, Card, CardBody, Typography} from "@material-tailwind/react";
import DeleteDialog from "@/app/workouts/[workoutId]/components/DeleteDialog";
import ExerciseSelectorDialog from "@/app/workouts/[workoutId]/components/ExerciseSelectorDialog";
import RoutineTable from "@/app/workouts/[workoutId]/components/RoutineTable";
import SetEditorDialog from "@/app/workouts/[workoutId]/components/SetEditorDialog";

interface Props {
  workout: WorkoutsQuery['workouts'][any];
  refetch: ReturnType<typeof useWorkoutsQuery>['refetch'];
}

const WorkoutDetails: FunctionComponent<Props> = ({
  workout,
  refetch,
}) => {
  const [isDeleteRoutineDialogOpen, setIsDeleteRoutineDialogOpen] = useState(false);
  const [routineIdToDelete, setRoutineIdToDelete] = useState<string | undefined>();
  const {mutate: deleteRoutine, isPending: isDeleteRoutineIsPending} = useDeleteRoutineMutation();
  const [isExerciseSelectorDialogOpen, setIsExerciseSelectorDialogOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>();
  const [isSetEditorDialogOpen, setIsSetEditorDialogOpen] = useState(false);
  const [routineIdToExtend, setRoutineIdToExtend] = useState<string | undefined>();
  const {mutate: addSet} = useAddNewSetMutation();

  return <div>
    {workout.setGroups.length === 0 &&
        <Typography className="text-center text-blue-gray-500">No routines</Typography>}
    {workout.setGroups.map((setGroup, index) => (
      <Card className="mb-4 bg-teal-50" key={setGroup.id}>
        <CardBody>
          <div className="flex justify-between mb-2 items-center">
            <Typography variant="h5" color="blue-gray">Routine #{index + 1}</Typography>
            <div className="flex gap-4">
              <Button
                ripple={false}
                variant="outlined"
                onClick={() => {
                  setRoutineIdToExtend(setGroup.id)
                  setIsExerciseSelectorDialogOpen(true)
                }}
              >
                Add Set
              </Button>
              <Button
                color="red"
                ripple={false}
                onClick={() => {
                  setIsDeleteRoutineDialogOpen(true);
                  setRoutineIdToDelete(setGroup.id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
          {setGroup.sets.length === 0
            ? <Typography className="text-center text-blue-gray-500">No sets</Typography>
            : <RoutineTable setGroup={setGroup} refetch={refetch}/>
          }
        </CardBody>
      </Card>
    ))}
    <DeleteDialog
      open={isDeleteRoutineDialogOpen}
      handler={setIsDeleteRoutineDialogOpen}
      description={`routine`}
      isDeletePending={isDeleteRoutineIsPending}
      deleteCallback={() => routineIdToDelete && deleteRoutine(
        {
          routineId: routineIdToDelete,
        },
        {
          onSuccess: () => {
            setIsDeleteRoutineDialogOpen(false);
            refetch();
          },
        },
      )}
    />
    {routineIdToExtend && <ExerciseSelectorDialog
      open={isExerciseSelectorDialogOpen}
      handler={setIsExerciseSelectorDialogOpen}
      selectCallback={(exerciseId) => {
        setSelectedExerciseId(exerciseId);
        setIsExerciseSelectorDialogOpen(false);
        setIsSetEditorDialogOpen(true);
      }}
    />}
    {routineIdToExtend && selectedExerciseId &&
        <SetEditorDialog
            open={isSetEditorDialogOpen}
            set={{exerciseId: selectedExerciseId}}
            onSubmit={(set) => addSet(
              {
                setGroupId: routineIdToExtend,
                set,
              },
              {
                onSettled: () => {
                  setIsSetEditorDialogOpen(false);
                  refetch();
                },
              },
            )}
            onCancel={() => {
                  setSelectedExerciseId(undefined);
                  setRoutineIdToExtend(undefined);
                  setIsSetEditorDialogOpen(false);
                  refetch();
            }}
        />
    }
  </div>
}

export default WorkoutDetails;
