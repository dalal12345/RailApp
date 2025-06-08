import { useJourneyStore } from "@/store/journeyStore";
import { useTrainStore } from "@/store/trainStore";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function JourneyInfo() {
  const journeyDate = useJourneyStore((state) => state.journeyDate);
  const formattedJuourneyDate = useJourneyStore(
    (state) => state.formattedJourneyDate,
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
            <li className="sm:col-span-2">{formattedJuourneyDate} <span>{(!journeyDate && !formattedJuourneyDate) || ' <->'}</span> {journeyDate}</li>
            
        </ul>
        </CardBody>
      </Card>
  );
}
