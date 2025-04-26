import {FunctionComponent} from "react";
import {Card, CardBody, Typography} from "@material-tailwind/react";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";

interface Props {
  children: string;
}

const ErrorBanner: FunctionComponent<Props> = ({children}) => (
  <Card shadow={false} className="border-red-500 border-2 bg-red-50">
    <CardBody className="p-4 flex items-center text-red-500">
      <ExclamationCircleIcon className="h-6 pr-2"/>
      <Typography>{children}</Typography>
    </CardBody>
  </Card>
)

export default ErrorBanner;
