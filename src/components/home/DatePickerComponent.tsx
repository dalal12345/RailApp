import { useJourneyStore } from "@/store/journeyStore";
import { DatePicker, DateValue } from "@heroui/react";

export default function DatePickerComponent() {
  const journeyDateGenerator = useJourneyStore(
    (state) => state.journeyDateGenerator
  );
  return (
    <DatePicker
      className="max-w-[284px]"
      label="Journey Date"
      onChange={(newDate: DateValue | null) => journeyDateGenerator(newDate)}
    />
  );
}
