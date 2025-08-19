import {ComponentProps, FunctionComponent, useState} from "react";
import {useDeleteRoutineMutation, WorkoutsQuery} from "repvault-api-client";
import {Button, Card, CardBody, Typography} from "@material-tailwind/react";
import Table from "@/app/components/Table/Table";
import DeleteDialog from "@/app/workouts/[workoutId]/components/DeleteDialog";

interface Props {
  workout: WorkoutsQuery['workouts'][any];
  refetch: () => void;
}

type Set = WorkoutsQuery['workouts'][any]['setGroups'][any]['sets'][any];

const columns: ComponentProps<typeof Table<Set>>['columns'] = [
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

const WorkoutDetails: FunctionComponent<Props> = ({
  workout,
  refetch,
}) => {
  const [isDeleteRoutineDialogOpen, setIsDeleteRoutineDialogOpen] = useState(false);
  const [routineIdToDelete, setRoutineIdToDelete] = useState<string>();
  const {mutate: deleteRoutine, isPending: isDeleteRoutineIsPending} = useDeleteRoutineMutation();

  return <div>
    {workout.setGroups.length === 0 &&
        <Typography className="text-center text-blue-gray-500">No routines</Typography>}
    {workout.setGroups.map((setGroup, index) => (
      <Card className="mb-4 bg-teal-50" key={setGroup.id}>
        <CardBody>
          <div className="flex justify-between mb-2">
            <Typography variant="h5" color="blue-gray">Routine #{index + 1}</Typography>
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
          <Table
            data={setGroup.sets}
            columns={columns}
            rowKey={(row) => `${setGroup.id}/${row.id}`}
          />
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
          routineId: routineIdToDelete
        },
        {
          onSuccess: () => {
            setIsDeleteRoutineDialogOpen(false);
            refetch();
          }
        }
      )}
    />
  </div>
}

export default WorkoutDetails;
