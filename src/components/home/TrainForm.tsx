import { Button } from "@heroui/react";
import OriginStationDropDown from "./OriginStationDropdown";
import DestinationStationDropDown from "./DestinationStationDropDown";
import DatePickerComponent from "./DatePickerComponent";
import JourneyInfo from "./JourneyInfo";
import { useTrainStore } from "@/store/trainStore";
import { isEmpty } from "lodash";
import UserTrainListComponent from "./UserTrainListComponent";
import UserTrainListEmptyAlert from "./UserTrainListEmptyAlert";
import LoaderComponent from "./LoaderComponent";
import { useJourneyStore } from "@/store/journeyStore";

export default function TrainForm() {
  const fetchUserTrainList = useTrainStore((state) => state.fetchUserTrainList);
  const userTrainList = useTrainStore((state) => state.userTrainList);
  const setUserTrainList = useTrainStore((state) => state.setUserTrainList);
  const setHasTrainBeenSearchedOnce = useTrainStore((state) => state.setHasTrainBeenSearchedOnce);
  const hasTrainBeenSearchedOnce = useTrainStore((state) => state.hasTrainBeenSearchedOnce);
  const setIsTrainFetchingLoading = useTrainStore((state) => state.setIsTrainFetchingLoading);
    const isTrainFetchingLoading = useTrainStore((state) => state.isTrainFetchingLoading);
    const setDestinationStation = useJourneyStore((state)=>state.setDestinationStation);
     const setOriginStation = useJourneyStore((state)=>state.setOriginStation);


  return (
    <div className="grid justify-items-center sm:grid-cols-2  gap-2 h-fit">
      <OriginStationDropDown />
      <DestinationStationDropDown />
      <DatePickerComponent />
      <Button
        variant="shadow"
        color="primary"
        className="p-7 font-bold"
        onPress={()=>{
          setUserTrainList([]);
          setIsTrainFetchingLoading(true);
          fetchUserTrainList();
          setHasTrainBeenSearchedOnce(true);
        }}
      >
        Find Trains
      </Button>
      {!isEmpty(userTrainList) && <UserTrainListComponent />}
      {!isTrainFetchingLoading && hasTrainBeenSearchedOnce && isEmpty(userTrainList) && <UserTrainListEmptyAlert/>}
      {isTrainFetchingLoading && <LoaderComponent/>}
      <JourneyInfo />
    </div>
  );
}
