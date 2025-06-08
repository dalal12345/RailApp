import { Spinner } from "@heroui/react";


export default function LoaderComponent(){
    return(<div className="h-28 grid justify-items-center items-center">
        <Spinner color="primary" label="Finding Trains" labelColor="primary" />
    </div>);
}