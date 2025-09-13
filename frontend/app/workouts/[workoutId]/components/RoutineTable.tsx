import {ComponentProps, Dispatch, FunctionComponent, SetStateAction, useState} from "react";
import Table from "@/app/components/Table/Table";
import {
  SetType,
  useDeleteSetMutation,
  useUpdateSetMutation,
  useWorkoutsQuery, WeightUnit,
  WorkoutsQuery,
} from "repvault-api-client";
import NumericEditorCell from "@/app/workouts/[workoutId]/components/NumericEditorCell";
import {CheckIcon, PencilIcon, TrashIcon} from "@heroicons/react/16/solid";
import {Select, Option} from "@material-tailwind/react";

type SetGroup = WorkoutsQuery['workouts'][any]['setGroups'][any];
export type Set = SetGroup['sets'][any];

interface Props {
  setGroup: SetGroup;
  refetch: ReturnType<typeof useWorkoutsQuery>['refetch'];
}

const setterForProperty = (setEditedSet: Dispatch<SetStateAction<Set | undefined>>, property: keyof Set) =>
  (valueOrSetter: SetStateAction<number | undefined>) =>
    setEditedSet((previousState) =>
      !previousState ? undefined : ({
        ...previousState,
        ...(previousState[property] === null || previousState[property] === undefined ||
        typeof previousState[property] === "number" ?
          {
            [property]: typeof valueOrSetter === "function"
              ? valueOrSetter(previousState[property] ?? undefined)
              : valueOrSetter,
          } : {}),
      }))

const columns = (
  setEditedSet: (value: SetStateAction<Set | undefined>) => void,
  editingAtIndex?: number,
  editedSet?: Set,
): ComponentProps<typeof Table<Set>>['columns'] => [
  {
    header: "Exercise",
    accessor: ({value}) => value.exercise.name,
  },
  {
    header: "Type",
    accessor: ({value, index}) => index === editingAtIndex && editedSet
      ? <Select
        size="md"
        value={editedSet.setType ?? undefined}
        onChange={(value) => setEditedSet((previousState) =>
          !previousState ? undefined : ({
            ...previousState,
            setType: value as SetType,
          }))}
        containerProps={{
          className: "!min-w-0 !h-8 !w-24",
        }}
      >
        <Option key="warmup" value={SetType.WarmUp}>warmup</Option>
        <Option key="main" value={SetType.Main}>main</Option>
      </Select>
      : value.setType,
  },
  {
    header: "Weight",
    accessor: ({value, index}) => index === editingAtIndex && editedSet
      ? <div className="flex flex-row gap-1">
        <NumericEditorCell
          value={editedSet.weight ?? undefined}
          setValue={setterForProperty(setEditedSet, "weight")}
        />
        <Select
          size="md"
          value={editedSet.weightUnit ?? undefined}
          onChange={(value) => setEditedSet((previousState) =>
            !previousState ? undefined : ({
              ...previousState,
              weightUnit: (value ?? "KG") as WeightUnit,
            }))}
          containerProps={{
            className: "!min-w-0 !h-8 !w-16",
          }}
        >
          <Option key="kg" value={WeightUnit.Kg}>kg</Option>
          <Option key="lb" value={WeightUnit.Lb}>lbs</Option>
        </Select>
      </div>
      : `${value.weight} ${value.weightUnit}`,
  },
  {
    header: "Reps",
    accessor: ({value, index}) => index === editingAtIndex && editedSet
      ? <NumericEditorCell
        value={editedSet.repetitions ?? undefined}
        setValue={setterForProperty(setEditedSet, "repetitions")}
      />
      : value.repetitions,
  },
  {
    header: "Rest",
    accessor: ({value, index}) => index === editingAtIndex && editedSet
      ? <NumericEditorCell
        value={editedSet.restAfter ?? undefined}
        setValue={setterForProperty(setEditedSet, "restAfter")}
        increment={5}
      />
      : `${value.restAfter ?? "-"} sec`,
  },
]

const rowActions = (
  setEditingAtIndex: (index: SetStateAction<number | undefined>) => void,
  setEditedSet: (value: SetStateAction<Set | undefined>) => void,
  deleteSet: ReturnType<typeof useDeleteSetMutation>['mutate'],
  refetch: ReturnType<typeof useWorkoutsQuery>['refetch'],
  updateSet: ReturnType<typeof useUpdateSetMutation>['mutate'],
  editingAtIndex?: number,
  editedSet?: Set,
): ComponentProps<typeof Table<Set>>['rowActions'] =>
  (row) =>
    row.index === editingAtIndex
      ? [
        {
          icon: <CheckIcon className="size-full"/>,
          onClick: (row, finalizeAction) => {
            editedSet && updateSet(
              {
                setId: row.value.id,
                setInput: {
                  exerciseId: editedSet.exercise.id,
                  repetitions: editedSet.repetitions,
                  weight: editedSet.weight,
                  weightUnit: editedSet.weightUnit,
                  setType: editedSet.setType,
                  restAfter: editedSet.restAfter,
                },
              }, {
                onSettled: () => {
                  setEditingAtIndex(undefined);
                  setEditedSet(undefined);
                  refetch();
                  finalizeAction();
                },
              })
          },
        },
      ]
      : [
        {
          icon: <PencilIcon className="size-full"/>,
          onClick: ({value, index}, finalizeAction) => {
            setEditingAtIndex(index);
            setEditedSet(value);
            finalizeAction();
          },
        },
        {
          icon: <TrashIcon className="size-full"/>,
          color: "red",
          onClick: ({value}, finalizeAction) => {
            deleteSet({setId: value.id}, {
              onSettled: () => {
                finalizeAction();
                refetch()
              },
            })
          },
        },
      ];

const RoutineTable: FunctionComponent<Props> = ({
  setGroup,
  refetch,
}) => {
  const [editingAtIndex, setEditingAtIndex] = useState<number | undefined>();
  const {mutate: deleteSet} = useDeleteSetMutation();
  const {mutate: updateSet} = useUpdateSetMutation();
  const [editedSet, setEditedSet] = useState<Set | undefined>();

  return <Table
    data={setGroup.sets}
    columns={columns(setEditedSet, editingAtIndex, editedSet)}
    rowKey={(row) => `${setGroup.id}/${row.id}`}
    rowActions={rowActions(setEditingAtIndex, setEditedSet, deleteSet, refetch, updateSet, editingAtIndex, editedSet)}
  />
}

export default RoutineTable;
