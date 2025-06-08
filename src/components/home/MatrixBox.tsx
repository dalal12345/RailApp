import { fetch } from "@tauri-apps/plugin-http";
import {  useState } from "react";
import clsx from "clsx";
import { ArrowDown, X } from "lucide-react";
import { useTrainStore } from "@/store/trainStore";
import { Button, Spinner, Link } from "@heroui/react";
import { useJourneyStore } from "@/store/journeyStore";

interface SeatType {
  type: string;
  fare: number;
  vat_amount: number;
  seat_counts: {
    online: number;
    offline: number;
  };
}

export default function MatrixBox() {
  const routeList = useTrainStore((state) => state.routeList);
  const selectedTrainName = useTrainStore((state) => state.userTrainName);
  const formattedDate = useJourneyStore((state) => state.formattedJourneyDate);

  const [trainData, setTrainData] = useState<SeatType[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createMatrix = async () => {
    setIsLoading(true);
    try {
      const size = routeList.length;
      const dataMatrix: SeatType[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null as any)
      );

      const fetchTasks: Promise<void>[] = [];

      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          const from = routeList[i];
          const to = routeList[j];

          if (from === to) continue;

          const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${from}&to_city=${to}&date_of_journey=${formattedDate}&seat_class=SHULOV`;

          const task = fetch(tempUrl)
            .then((res) => res.json())
            .then((jsonData) => {
              const trainList = jsonData?.data?.trains || [];
              const train = trainList.find(
                (t: any) => t?.trip_number === selectedTrainName
              );
              const seatTypes = train?.seat_types || [];

              dataMatrix[i][j] = seatTypes.filter(
                (item:any) => item.seat_counts.online + item.seat_counts.offline > 0
              );
            })
            .catch((err) =>
              console.error(`Error fetching ${from} -> ${to}:`, err)
            );

          fetchTasks.push(task);
        }
      }

      await Promise.all(fetchTasks);
      setTrainData(dataMatrix);
    } catch (e) {
      console.error("Matrix fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-4 max-w-[85vw] mx-auto">
      {/* Fetch Button */}
      <div className="flex justify-center mb-3">
        <Button
          onPress={createMatrix}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              Fetching...
            </>
          ) : (
            "Fetch Ticket"
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-6 text-gray-500 flex items-center justify-center gap-2">
          <Spinner />
          Loading ticket availability...
        </div>
      ) : trainData.length > 0 ? (
        <div className="overflow-x-auto max-h-[80vh] dark:bg-zinc-900 rounded shadow border dark:border-zinc-700">
          {/* Table Container */}
          <table className="min-w-full table-auto border-collapse dark:bg-zinc-900">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-30 h-12 w-32 font-bold dark:bg-zinc-900 text-white border border-white dark:border-zinc-700 text-center bg-blue-600">
                  <div className="flex items-center justify-center text-sm dark:bg-zinc-900">
                    From{" "}
                    <ArrowDown
                      size={16}
                      className="ml-1"
                    />
                  </div>
                </th>
                {routeList.map((city, idx) => (
                  <th
                    key={`head-${idx}`}
                    className={clsx(
                      "sticky top-0 font-bold text-white text-xs truncate p-2 z-50 dark:bg-zinc-900",
                      idx % 2 === 0 ? "bg-amber-500" : "bg-blue-600"
                    )}
                    title={city}
                  >
                    {city.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainData.map((row, i) => (
                <tr key={i}>
                  <td
                    className={clsx(
                      "sticky left-0 font-bold text-white text-xs truncate p-2 border dark:border-zinc-700   z-40 shadow-sm shadow-black",
                      i % 2 === 0
                        ? "bg-amber-500 dark:bg-zinc-900"
                        : "bg-blue-600 dark:bg-zinc-900"
                    )}
                    title={routeList[i]}
                  >
                    {routeList[i].replace(/_/g, " ")}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={clsx(
                        "p-2 text-xs border border-gray-200 min-w-[100px] max-w-[150px] dark:bg-zinc-900 dark:border-zinc-700",
                        j % 2 === 0 ? "bg-amber-50" : "bg-blue-50"
                      )}
                    >
                      {Array.isArray(cell) && cell.length > 0 ? (
                        cell.map((item, k) => {
                          const total =
                            item.seat_counts.online + item.seat_counts.offline;
                          if (total <= 0) return null;

                          return (
                            <div
                              key={k}
                              className="w-full p-2 mb-1  dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded shadow-sm"
                            >
                              <div className="font-bold text-blue-600 dark:text-blue-400 truncate dark:bg-transparent">
                                {item.type}
                              </div>
                              <div className="text-green-700 dark:text-green-400 font-medium dark:bg-transparent">
                                <span className="font-bold text-lg">
                                  {total}
                                </span>{" "}
                                Seats
                              </div>
                              <div className="text-gray-700 dark:text-gray-300 font-semibold dark:bg-transparent">
                                {Number(item.fare) + item.vat_amount} TK
                              </div>
                              <Link
                                href={`https://eticket.railway.gov.bd/booking/train/search?fromcity=${routeList[i]}&tocity=${routeList[j]}&doj=${formattedDate}&class=${item.type}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block px-3 py-1 text-xs font-bold text-white  bg-blue-600  rounded hover:bg-green-700"
                              >
                                Buy
                              </Link>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-center dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 h-16">
                          <X size={20} />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 dark:text-zinc-400">
          No tickets found for this train.
        </div>
      )}
    </div>
  );
}
