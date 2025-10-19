import {FunctionComponent, useState} from "react";
import {
  useWorkoutsQuery,
  SetGroup, Set, useUpdateSetMutation,
} from "repvault-api-client";
import {Typography} from "@material-tailwind/react";
import SetEditorDialog from "@/app/workouts/[workoutId]/components/SetEditorDialog";
import SetMenu from "@/app/workouts/[workoutId]/components/SetMenu";

interface Props {
  setGroup: SetGroup;
  refetch: ReturnType<typeof useWorkoutsQuery>['refetch'];
}

interface ExerciseGroup {
  exercise: Set['exercise'],
  sets: Set[],
}

const RoutineTable: FunctionComponent<Props> = ({
  setGroup,
  refetch,
}) => {
  const {mutate: updateSet} = useUpdateSetMutation();
  const [editedSet, setEditedSet] = useState<Set | undefined>();
  const [isSetEditorDialogOpen, setIsSetEditorDialogOpen] = useState(false);

  const groupedSets: ExerciseGroup[] = setGroup.sets.reduce((grouped: ExerciseGroup[], current) => {
    if (grouped.length && grouped[grouped.length - 1].exercise.id === current.exercise.id) {
      grouped[grouped.length - 1].sets.push(current);
    } else {
      grouped.push({
        exercise: current.exercise,
        sets: [current],
      })
    }
    return grouped;
  }, [])

  return <div>
    {groupedSets.map(({exercise, sets}, index) =>
      <div key={index}>
        <Typography color="black" variant="h6">{exercise.name}</Typography>
        <div>
          {sets.map((set) => <div key={set.id} className="flex items-center">
            <div className="grid grid-cols-5 flex-grow">
              <Typography className="pl-4 col-span-2">{set.setType}</Typography>
              <Typography className="text-right">{set.weight} {set.weightUnit}</Typography>
              <Typography className="text-right">{set.repetitions}</Typography>
              <Typography className="text-right">{set.restAfter} s</Typography>
            </div>
            <SetMenu
              set={set}
              setEditedSet={setEditedSet}
              setIsSetEditorDialogOpen={setIsSetEditorDialogOpen}
              refetch={refetch}
            />
          </div>)}
        </div>
      </div>,
    )}
    {editedSet &&
        <SetEditorDialog
            open={isSetEditorDialogOpen}
            setId={editedSet.id}
            set={{
              // Manually filled to avoid passing the id field, which would cause issues on submit
              exerciseId: editedSet.exercise.id,
              repetitions: editedSet.repetitions,
              weight: editedSet.weight,
              weightUnit: editedSet.weightUnit,
              setType: editedSet.setType,
              restAfter: editedSet.restAfter,
            }}
            onSubmit={(set) => updateSet(
              {
                setId: editedSet.id,
                setInput: set
              },
              {
                onSettled: () => {
                  setEditedSet(undefined);
                  setIsSetEditorDialogOpen(false);
                  refetch();
                }
              }
            )}
            onCancel={() => {
              setEditedSet(undefined);
              setIsSetEditorDialogOpen(false);
            }}
        />
    }
  </div>
}

export default RoutineTable;
