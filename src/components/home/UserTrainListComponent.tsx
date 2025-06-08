import { useTrainStore } from "@/store/trainStore";
import { Card, CardBody } from "@heroui/card";

export default function UserTrainListComponent() {
  const userTrainList = useTrainStore((state) => state.userTrainList);
  const setUserTrainName = useTrainStore((state) => state.setUserTrainName);
  return (
    <Card className="sm:col-span-2 w-full">
      <CardBody>
        <ul>
          {userTrainList.map((train, index) => (
            <li
              key={index}
              onClick={() => setUserTrainName(train)}
              className="cursor-pointer hover:shadow-sm hover:shadow-black hover:bg-gray-50 p-1 rounded-md"
            >
              {train}
            </li>
          ))}
        </ul>
       
      </CardBody>
    </Card>
  );
}
