import { useJourneyStore } from "@/store/journeyStore";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function DestinationStationDropDown() {
  const items = useJourneyStore((state) => state.destinationStationList);
  
  const setDestinationStation = useJourneyStore((state) => state.setDestinationStation);
  return (
    <Autocomplete label="Destination Station">
      {items.map((item) => (
        <AutocompleteItem key={item.key} onPress={()=>setDestinationStation(item.label as string)}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
