import {Typography} from "@material-tailwind/react";
import {FunctionComponent} from "react";
import {InformationCircleIcon} from "@heroicons/react/20/solid";

const RequiredLabel: FunctionComponent = () => (
  <div className="text-blue-gray-700 flex items-center">
    <InformationCircleIcon className="h-[21px] pr-0.5"/>
    <Typography variant="small">This field is required</Typography>
  </div>
)

export default RequiredLabel;
