"use client"

import Table from "@/app/components/Table/Table";
import {useDeleteExerciseMutation, useExercisesQuery} from "repvault-api-client";
import {Button, Spinner, Typography} from "@material-tailwind/react";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";

export default function Exercises() {
  const {isPending, data, refetch} = useExercisesQuery()
  const {mutate: deleteExercise} = useDeleteExerciseMutation();

  return (<div>
    <Typography variant="h4" className="mb-4">Exercises</Typography>
    {isPending ? <Spinner className="h-8 w-8 mx-auto"/> : (
    <>
      <a href="exercises/add">
        <Button className="mb-4" size="sm" variant="outlined" ripple={false}>Add</Button>
      </a>
      <Table
        data={data?.exercises.data || []}
        columns={[
          {
            header: "id",
            accessor: (row) => row.value.id,
          },
          {
            header: "name",
            accessor: (row) => row.value.name,
          },
          {
            header: "instruction",
            accessor: (row) => row.value.instructions.join(", ")
          }
        ]}
        rowKey={(row) => `${row.id}-${row.name}`}
        rowActions={[
          {
            icon: <PencilIcon className="size-full"/>,
            link: ({value}) => `exercises/${value.id}/edit`
          },
          {
            icon: <TrashIcon className="size-full"/>,
            color: "red",
            onClick: ({value}, finalizeAction) => {
              deleteExercise({id: value.id}, {
                onSettled: () => {
                  finalizeAction();
                  refetch();
                }
              })
            },
          }
        ]}
      />
    </>)}
  </div>);
}
