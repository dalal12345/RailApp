import { useTrainStore } from "@/store/trainStore";
import { Card, CardBody } from "@heroui/card";
import clsx from "clsx";

export default function UserTrainListComponent() {
  const userTrainList = useTrainStore((state) => state.userTrainList);
  const setUserTrainName = useTrainStore((state) => state.setUserTrainName);
  const userTrainName = useTrainStore((state) => state.userTrainName);
  const extractTrainModel = useTrainStore((state) => state.extractTrainModel);
  return (
    <Card className="sm:col-span-2 w-full">
      <CardBody>
        <ul>
          {userTrainList.map((train, index) => (
            <li
              key={index}
              onClick={() =>{ 
                setUserTrainName(train);
                extractTrainModel(train);
               
              }}
              className={clsx(
                "cursor-pointer hover:shadow-sm hover:shadow-black  p-2 rounded-md",
                {
                  "text-green-600 font-bold": userTrainName === train,
                }
              )}
            >
              {train}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
