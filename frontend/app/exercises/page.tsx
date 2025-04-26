"use client"

import Table from "@/app/components/Table/Table";
import {useExercisesQuery} from "repvault-api-client";
import {Button, Spinner} from "@material-tailwind/react";

export default function Home() {
  const {isPending, data} = useExercisesQuery()

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
      />
    </>
  );
}
