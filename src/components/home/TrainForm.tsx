import { Alert, Button } from "@heroui/react";
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
import ProperJourneyInformationAlert from "./ProperJourneyInformationAlert";
import MannualTrainSelection from "./MannualTrainSelection";


export default function TrainForm() {
  const fetchUserTrainList = useTrainStore((state) => state.fetchUserTrainList);
  const userTrainList = useTrainStore((state) => state.userTrainList);
  const setUserTrainList = useTrainStore((state) => state.setUserTrainList);
  const setHasTrainBeenSearchedOnce = useTrainStore(
    (state) => state.setHasTrainBeenSearchedOnce
  );
  const hasTrainBeenSearchedOnce = useTrainStore(
    (state) => state.hasTrainBeenSearchedOnce
  );
  const setIsTrainFetchingLoading = useTrainStore(
    (state) => state.setIsTrainFetchingLoading
  );
  const isTrainFetchingLoading = useTrainStore(
    (state) => state.isTrainFetchingLoading
  );
  const isReadyToFetchUserTrainList = useJourneyStore(
    (state) => state.isReadyToFetchUserTrainList
  );
  const setIsReadyToFetchUserTrainList = useJourneyStore(
    (state) => state.setIsReadyToFetchUserTrainList
  );

  const journeyDate = useJourneyStore((state) => state.journeyDate);
  const originStation = useJourneyStore((state) => state.originStation);
  const destinationStation = useJourneyStore(
    (state) => state.destinationStation
  );
  const setUserTrainName = useTrainStore((state) => state.setUserTrainName);
  const routeList = useTrainStore((state) => state.routeList);

  const fetchUserTrainInformation = useTrainStore(
    (state) => state.fetchUserTrainInformation
  );

  return (
    <div className="grid justify-items-center sm:grid-cols-2  gap-2 h-fit">
      <OriginStationDropDown />
      <DestinationStationDropDown />
      <DatePickerComponent />
      <Button
        variant="shadow"
        color="primary"
        className="p-7 font-bold w-2/3"
        onPress={() => {
          let ready = false;
          setUserTrainName(null);
          if (
            journeyDate &&
            originStation &&
            destinationStation &&
            originStation !== destinationStation
          ) {
            ready = true;
            setIsReadyToFetchUserTrainList(ready);
          } else {
            ready = false;
            setIsReadyToFetchUserTrainList(ready);
          }
          console.log(isReadyToFetchUserTrainList);
          if (ready) {
            console.log("Yes ready Fetching");
            setUserTrainList([]);
            setIsTrainFetchingLoading(true);
            fetchUserTrainList();
            setHasTrainBeenSearchedOnce(true);
            setIsReadyToFetchUserTrainList(true);
          } else {
            console.log("Not Ready ready to fetch");
            setHasTrainBeenSearchedOnce(false);
          }
        }}
      >
        Find Trains
      </Button>
      {!isEmpty(userTrainList) && <UserTrainListComponent />}
      {!isTrainFetchingLoading &&
        hasTrainBeenSearchedOnce &&
        isEmpty(userTrainList) && <UserTrainListEmptyAlert />}
      {isTrainFetchingLoading && <LoaderComponent />}
      {originStation &&
        destinationStation &&
        originStation === destinationStation && (
          <Alert
            color="warning"
            className="sm:col-span-2"
          >
            Origin and Destination must be different!
          </Alert>
        )}

      {!isReadyToFetchUserTrainList &&
        (!journeyDate || !originStation || !destinationStation) && (
          <ProperJourneyInformationAlert />
        )}

      <JourneyInfo />
      <MannualTrainSelection />
      <DatePickerComponent />
      <Alert color="success">
        Select your train from this dropdown menu if you haven't found one yet
      </Alert>
      <Button
        className="self-center justify-self-center  p-7 font-bold w-2/3"
        color="primary"
        onPress={() => {
          fetchUserTrainInformation();
        }}
      >
        Find Route
      </Button>
      {!isEmpty(routeList) && <ul className="overflow-auto max-h-32">
        {
          routeList.map((route,index)=>(<li key={index}>{route}</li>))
        }
        </ul>}
     
    </div>
  );
}
