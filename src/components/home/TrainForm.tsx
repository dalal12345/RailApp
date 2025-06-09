import { addToast, Alert, Button } from "@heroui/react";
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
import MannualTrainSelection from "./MannualTrainSelection";
import OnlyTrainSelectionError from "./OnlyTrainSelectionError";

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

  const userTrainName = useTrainStore((state) => state.userTrainName);

  const fetchUserTrainInformation = useTrainStore(
    (state) => state.fetchUserTrainInformation
  );

  return (
    <div className="grid justify-items-center sm:grid-cols-2  gap-2 h-fit md:w-3/5">
      <OriginStationDropDown />
      <DestinationStationDropDown />
      <DatePickerComponent />
      <Button
        variant="shadow"
        color="primary"
        className="p-7 font-bold w-2/3 "
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

      {/* {!isReadyToFetchUserTrainList &&
        (!journeyDate || !originStation || !destinationStation) && (
          <ProperJourneyInformationAlert />
        )} */}

      {(journeyDate || userTrainName || originStation || destinationStation) &&  <JourneyInfo />}

      {userTrainName && !journeyDate && <OnlyTrainSelectionError />}
      <div className="mt-4 gap-4 w-full grid sm:grid-cols-2 sm:col-span-2">
        <MannualTrainSelection />
        <DatePickerComponent />
      </div>

      <div className="grid mt-4 gap-4 sm:col-span-2 sm:grid-cols-2">
        {!userTrainName && (
          <Alert color="success">
            Select your train from this dropdown menu if you haven't found one
            yet
          </Alert>
        )}
        {
          <Button
            className="self-center justify-self-center  p-7 font-bold w-2/3 "
            color="primary"
            onPress={() => {
              if (userTrainName && journeyDate) {
                fetchUserTrainInformation();
              } else {
                addToast({
                  title: "Date or Train Name error",
                  description: `Make sure you set both journey date and train name correctly...`,
                  color: "danger",
                  timeout: 3000,
                });
              }
            }}
          >
            Find Tickets
          </Button>
        }
      </div>
    </div>
  );
}
