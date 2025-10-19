import {FunctionComponent} from "react";
import {IconButton, Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {useDeleteSetMutation, Set} from "repvault-api-client";

interface Props {
  set: Set;
  setEditedSet: (set: Set) => void;
  setIsSetEditorDialogOpen: (open: boolean) => void;
  refetch: () => void;
}

const SetMenu: FunctionComponent<Props> = ({
  set,
  setIsSetEditorDialogOpen,
  setEditedSet,
  refetch,
}) => {
  const {mutate: deleteSet} = useDeleteSetMutation();

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <IconButton
          size="sm"
          variant="text"
          ripple={false}
          className="ml-2 flex-none"
        >
          <EllipsisVerticalIcon className="size-full"/>
        </IconButton>
      </MenuHandler>
      <MenuList>
        <MenuItem
          key="edit"
          onClick={() => {
            setEditedSet(set);
            setIsSetEditorDialogOpen(true);
          }}
        >
          Edit
        </MenuItem>
        <hr className="my-1 border-blue-gray-100"/>
        <MenuItem
          key="delete"
          onClick={() => deleteSet({setId: set.id}, {onSettled: () => refetch()})}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SetMenu;
