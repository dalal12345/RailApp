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
  hasTrainBeenSearchedOnce:boolean;
  isTrainFetchingLoading:boolean;
  setUserTrainRouteInformationList: (
    userTrainRouteInformation: UserTrainRouteInformation[] | []
  ) => void;
  fetchUserTrainList:()=>void;
  setHasTrainBeenSearchedOnce:(status:boolean)=>void;
  setIsTrainFetchingLoading:(status:boolean)=>void;
};

export const useTrainStore = create<UserTrainStore>((set,get) => ({
  userTrainList: [],
  userTrainModel: null,
  userTrainName: null,
  routeList: [],
  userTrainRouteInformationList: [],
  hasTrainBeenSearchedOnce:false,
  isTrainFetchingLoading:false,
  setIsTrainFetchingLoading:(status:boolean)=>set({isTrainFetchingLoading:status}),
  setHasTrainBeenSearchedOnce:(status:boolean)=>set({hasTrainBeenSearchedOnce:status}),
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
      
      const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${journeyStore.originStation}&to_city=${journeyStore.destinationStation}&date_of_journey=${journeyStore.formattedJuourneyDate}&seat_class=SHULOV`;
      let response = await fetch(tempUrl);
      let responseObject = await response.json();
      let trains = responseObject!.data!.trains.map((train: any) =>
        train!.trip_number.trim()
      );
      console.log(trains);
      set({userTrainList:trains});
    } catch (e: any) {
      console.log(e);
    } finally {
      const setIsTrainFetchingLoading = get().setIsTrainFetchingLoading;
      setIsTrainFetchingLoading(false);
    }
  },
}));
