import { StationListForDropdown } from "@/interface/StationInterfaceForDropdown";
import { DateValue } from "@heroui/calendar";
import { create } from "zustand";

interface JourneyState {
  journeyDate: string | null;
  setJourneyDate: (date: string | null) => void;
  formattedJuourneyDate: string | null;
  setFormattedJourneyDate: (date: string | null) => void;
  journeyDateGenerator: (date: DateValue | null) => void;
  selectedDate: DateValue | null;
  monthList: string[];
  seatClass: "SHULOV";
  originStation: string | null;
  destinationStation: string | null;
  setOriginStation: (station: string) => void;
  setDestinationStation: (station: string) => void;
  originStationList: StationListForDropdown | [];
  setOriginStationList: (list: any) => void;
  destinationStationList: StationListForDropdown | [];
  setDestinationStationList: (list: any) => void;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  journeyDate: null,
  setJourneyDate: (date: string | null) => set({ journeyDate: date }),
  formattedJuourneyDate: null,
  setFormattedJourneyDate: (date: string | null) =>
    set({ formattedJuourneyDate: date }),
  originStation: null,
  destinationStation: null,
  setOriginStation: (station: string | null) => set({ originStation: station }),
  setDestinationStation: (station: string | null) =>
    set({ destinationStation: station }),
  selectedDate: null,
  seatClass: "SHULOV",
  originStationList: [],
  setOriginStationList: (originStationList: any) =>
    set({ originStationList: originStationList }),
  destinationStationList: [],
  setDestinationStationList: (destinationStationList: any) =>
    set({ destinationStationList: destinationStationList }),
  monthList: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  journeyDateGenerator: (date: DateValue | null) => {
    if (!date) return;
    const tempDate = `${date.year}-${date.month}-${date.day}`;
    const { monthList } = get();
    const tempFormatedDate = `${date.day}-${monthList[date.month - 1]}-${
      date.year
    }`;
    set({ formattedJuourneyDate: tempFormatedDate, journeyDate: tempDate });
  },
}));
