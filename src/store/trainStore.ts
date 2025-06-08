import {
  UserTrainRouteInformation,
  UserTrainRouteInformationList,
} from "@/interface/userTrainRouteInformation";
import { create } from "zustand";
import { useJourneyStore } from "./journeyStore";
import { fetch } from "@tauri-apps/plugin-http";

type UserTrainStore = {
  userTrainList: string[] | [];
  routeList: string[] | [];
  userTrainModel: string | null;
  userTrainName: string | null;
  setUserTrainList: (trainList: string[] | []) => void;
  setUserRouteList: (routeList: string[] | []) => void;
  setUserTrainModel: (model: string | null) => void;
  setUserTrainName: (trainName: string | null) => void;
  userTrainRouteInformationList: UserTrainRouteInformationList | [];
  hasTrainBeenSearchedOnce: boolean;
  isTrainFetchingLoading: boolean;

  setUserTrainRouteInformationList: (
    userTrainRouteInformation: UserTrainRouteInformation[] | []
  ) => void;
  fetchUserTrainList: () => void;
  setHasTrainBeenSearchedOnce: (status: boolean) => void;
  setIsTrainFetchingLoading: (status: boolean) => void;
  fetchUserTrainInformation: () => void;
  extractTrainModel: (train: string) => void;
};

export const useTrainStore = create<UserTrainStore>((set, get) => ({
  userTrainList: [],
  userTrainModel: null,
  userTrainName: null,
  routeList: [],
  userTrainRouteInformationList: [],
  hasTrainBeenSearchedOnce: false,
  isTrainFetchingLoading: false,
  setIsTrainFetchingLoading: (status: boolean) =>
    set({ isTrainFetchingLoading: status }),
  setHasTrainBeenSearchedOnce: (status: boolean) =>
    set({ hasTrainBeenSearchedOnce: status }),
  setUserTrainRouteInformationList: (
    userTrainRouteInformation: UserTrainRouteInformation[] | []
  ) => set({ userTrainRouteInformationList: userTrainRouteInformation }),
  setUserTrainList: (trainList) => set({ userTrainList: trainList }),
  setUserRouteList: (allRoutes) => set({ routeList: allRoutes }),
  setUserTrainModel: (model: string | null) => set({ userTrainModel: model }),
  setUserTrainName: (name: string | null) =>
    set({
      userTrainName: name,
    }),
  fetchUserTrainList: async () => {
    try {
      const journeyStore = useJourneyStore.getState();

      const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${journeyStore.originStation}&to_city=${journeyStore.destinationStation}&date_of_journey=${journeyStore.formattedJourneyDate}&seat_class=SHULOV`;
      let response = await fetch(tempUrl);
      let responseObject = await response.json();
      let trains = responseObject!.data!.trains.map((train: any) =>
        train!.trip_number.trim()
      );
      console.log(trains);
      set({ userTrainList: trains });
    } catch (e: any) {
      console.log(e);
    } finally {
      const setIsTrainFetchingLoading = get().setIsTrainFetchingLoading;
      setIsTrainFetchingLoading(false);
    }
  },
  fetchUserTrainInformation: async () => {
    try {
      console.log("Started");
      const trainStore = get();
      const journeyStore = useJourneyStore.getState();
      const userTrainModel = trainStore.userTrainModel;
      const journeyDate = journeyStore.journeyDate;
      console.log("Reached 1");
      const response = await fetch(
        "https://railspaapi.shohoz.com/v1.0/web/train-routes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: userTrainModel,
            departure_date_time: journeyDate,
          }),
        }
      );

      console.log(response);

      if (response.status === 200) {
        const routeDataObject = await response.json();
        console.log(routeDataObject);
        set({ userTrainRouteInformationList: routeDataObject!.data!.routes });
        if (!routeDataObject?.data?.routes) return;
        const cityList = routeDataObject.data.routes.map(
          (route: { city: any }) => route.city
        );
        set({ routeList: cityList });
        console.log(cityList);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  },
  extractTrainModel: (train: string) => {
    let match = train.match(/\((\d+)\)/);
    let numberString = match![1];
    set({userTrainModel:numberString});
  },
}));
