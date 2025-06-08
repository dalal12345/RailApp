import { useJourneyStore } from "@/store/journeyStore";
import { useTrainStore } from "@/store/trainStore";
import { Alert } from "@heroui/alert";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";

export default function JourneyInfo() {
  const journeyDate = useJourneyStore((state) => state.journeyDate);
  const formattedJuourneyDate = useJourneyStore(
    (state) => state.formattedJuourneyDate
  );
  const originStation = useJourneyStore((state) => state.originStation);
  const destinationStation = useJourneyStore(
    (state) => state.destinationStation
  );
    const userTrainName = useTrainStore((state) => state.userTrainName);
  

  return (
    <Card className="w-full sm:col-span-2">
        <CardHeader className="text-xl font-bold">
          Journey Information
        </CardHeader>
        <CardBody>
        <ul className="grid sm:grid-cols-2">
            <li>Origin : {originStation}</li>
            <li>Destination : {destinationStation}</li>
            <li className="text-green-600 font-bold">{userTrainName}</li>
            <li className="sm:col-span-2">{journeyDate} <span>{(!journeyDate && !formattedJuourneyDate) || ' <->'}</span> {formattedJuourneyDate}</li>
            
        </ul>
        </CardBody>
        {
          (originStation && destinationStation) && (originStation === destinationStation) && <CardFooter>
            <Alert color="warning">Origin and Destination must be different!</Alert>
        </CardFooter>}
      </Card>
  );
}
