import { RouterProvider } from "react-router-dom";
import router from "@/route/router";
import ToastNotifications from "@/components/ToastNotifications";
import PartialLoading from "./components/PartialLoading";
import { useAppSelector } from "./store/hooks";
import useBeacon from "./components/BeaconComponent";

function App() {
  useBeacon();

  const bLoading = useAppSelector((state) => state.shared.bLoading);
  return (
    <div>
      {bLoading && <PartialLoading />}
      <RouterProvider router={router} />
      <ToastNotifications />
    </div>
  );
}

export default App;
