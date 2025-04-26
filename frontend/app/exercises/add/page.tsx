"use client";

import {FunctionComponent} from "react";
import AddEditForm from "@/app/exercises/components/AddEditForm";
import {useCreateExerciseMutation} from "repvault-api-client";
import {Typography} from "@material-tailwind/react";
import ErrorBanner from "@/app/components/Banner/ErrorBanner";
import {useRouter} from "next/navigation";

const AddExercisePage: FunctionComponent = () => {
  const {mutate, isError} = useCreateExerciseMutation();
  const {push} = useRouter();

  return (
    <div>
      <Typography variant="h4">Create Exercise</Typography>
      {isError && <ErrorBanner>There was an error creating the exercise.</ErrorBanner>}
      <AddEditForm onSubmit={(exercise, finalizeSubmit) => mutate(
        {input: exercise},
        {
          onSuccess: () => push("/exercises"),
          onError: () => window.scrollTo(0,0),
          onSettled: finalizeSubmit
        }
      )}/>
    </div>);
}

export default AddExercisePage;
