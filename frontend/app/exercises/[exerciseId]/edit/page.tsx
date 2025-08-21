"use client";

import {FunctionComponent, use} from "react";
import {useExercisesQuery, useUpdateExerciseMutation} from "repvault-api-client";
import AddEditForm from "@/app/exercises/components/AddEditForm";
import {Spinner, Typography} from "@material-tailwind/react";
import {useRouter} from "next/navigation";
import ErrorBanner from "@/app/components/Banner/ErrorBanner";

interface Props {
  params: Promise<{ exerciseId: string }>;
}

const EditExercisePage: FunctionComponent<Props> = ({params}) => {
  const {exerciseId} = use(params);
  const {isPending, data} = useExercisesQuery({filters: {id: exerciseId}});
  const {mutate: edit, isError} = useUpdateExerciseMutation();
  const {push} = useRouter();

  return isPending ? (<Spinner/>) : (<>
      <Typography variant="h4">Edit Exercise</Typography>
      {isError && <ErrorBanner>There was an error saving the exercise.</ErrorBanner>}
      <AddEditForm exercise={data?.exercises.data[0]} onSubmit={(exercise, finalizeSubmit) =>
        edit(
          {
            id: exerciseId,
            input: exercise,
          },
          {
            onSuccess: () => push("/exercises"),
            onError: () => window.scrollTo(0, 0),
            onSettled: finalizeSubmit,
          },
        )
      }/>
    </>
  );
}

export default EditExercisePage;
