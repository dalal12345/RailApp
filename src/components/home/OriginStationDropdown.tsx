import { useJourneyStore } from "@/store/journeyStore";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function OriginStationDropDown() {
  const items = useJourneyStore((state) => state.originStationList);
  const setOriginStation = useJourneyStore((state) => state.setOriginStation);
  return (
    <Autocomplete label="Origin Station">
      {items.map((item) => (
        <AutocompleteItem key={item.key} onPress={()=>setOriginStation(item.label as string)}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
