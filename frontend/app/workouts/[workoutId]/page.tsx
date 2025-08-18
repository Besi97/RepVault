"use client"

import {FunctionComponent, use} from "react";
import {useWorkoutsQuery} from "repvault-api-client";
import {Card, CardBody, Spinner, Typography} from "@material-tailwind/react";
import Table from "@/app/components/Table/Table";

interface Props {
  params: Promise<{ workoutId: string }>;
}

const WorkoutDetails: FunctionComponent<Props> = ({params}) => {
  const {workoutId} = use(params);
  const {isPending, data} = useWorkoutsQuery({id: workoutId});
  const workout = data?.workouts[0];

  return isPending ? <Spinner className="h-8 w-8 mx-auto"/> :
    <div>
      <Typography variant="h4" className="mb-4">{workout?.name}</Typography>
      {workout?.setGroups.map((setGroup, index) => (
        <Card className="mb-4 bg-teal-50" key={setGroup.id}>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">Routine #{index + 1}</Typography>
            <Table
              data={setGroup.sets}
              columns={[
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
                  accessor: (row) => `${row.weight} ${row.weightUnit}`
                },
                {
                  header: "Repetitions",
                  accessor: (row) => row.repetitions
                },
                {
                  header: "Rest",
                  accessor: (row) => `${row.restAfter} sec`
                }
              ]}
              rowKey={(row) => `${setGroup.id}/${row.id}`}/>
          </CardBody>
        </Card>
      ))}
    </div>;
};

export default WorkoutDetails;
