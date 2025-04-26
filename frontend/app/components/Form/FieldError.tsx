import {FunctionComponent} from "react";
import {Typography} from "@material-tailwind/react";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";

interface Props {
  children: string;
}

const FieldError: FunctionComponent<Props> = ({children}) => (
  <div className="text-red-500 flex items-center">
    <ExclamationCircleIcon className="h-[21px] pr-0.5"/>
    <Typography variant="small">{children}</Typography>
  </div>
);

export default FieldError;
