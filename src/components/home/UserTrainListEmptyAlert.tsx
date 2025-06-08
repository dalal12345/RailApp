import { Alert } from "@heroui/alert";
import { Fragment } from "react/jsx-runtime";

export default function UserTrainListEmptyAlert(){
    return(<Fragment>
        <Alert variant="bordered" color="danger">No Train is found on your route</Alert>
        <Alert variant="bordered" color="success">But You can manually select your train from dropdown below</Alert>
    </Fragment>);
}