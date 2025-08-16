"use client"

import Table from "@/app/components/Table/Table";
import {useDeleteExerciseMutation, useExercisesQuery} from "repvault-api-client";
import {Button, Spinner} from "@material-tailwind/react";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";

export default function Home() {
  const {isPending, data, refetch} = useExercisesQuery()
  const {mutate: deleteExercise} = useDeleteExerciseMutation();

  return isPending ? <Spinner className="h-8 w-8"/> : (
    <>
      <a href="exercises/add">
        <Button className="mb-4" size="sm" variant="outlined" ripple={false}>Add</Button>
      </a>
      <Table
        data={data?.exercises || []}
        columns={[
          {
            header: "id",
            accessor: (row) => row.id,
          },
          {
            header: "name",
            accessor: (row) => row.name,
          },
          {
            header: "instruction",
            accessor: (row) => row.instructions.join(", ")
          }
        ]}
        rowKey={(row) => `${row.id}-${row.name}`}
        rowActions={[
          {
            icon: <PencilIcon className="size-full"/>,
            link: ({id}) => `exercises/${id}/edit`
          },
          {
            icon: <TrashIcon className="size-full"/>,
            color: "red",
            onClick: ({id}, finalizeAction) => {
              deleteExercise({id}, {
                onSettled: () => {
                  finalizeAction();
                  refetch();
                }
              })
            },
          }
        ]}
      />
    </>
  );
}
