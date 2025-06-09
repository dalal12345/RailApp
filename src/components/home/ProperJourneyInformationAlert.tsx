import { Alert } from "@heroui/alert";
export default function ProperJourneyInformationAlert() {
  return (
    <div className="sm:col-span-2 mt-5">
      <Alert
        variant="bordered"
        color="warning"
      >
        Ensure all fields are filled including Origin station, Destination
        station and Date too
      </Alert>
    </div>
  );
}
