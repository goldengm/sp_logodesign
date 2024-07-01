import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { setNotifyMsg } from "@/store/reducers/share";

export default function ToastNotifications() {
  const notifyMessage = useAppSelector((state) => state.shared.notifyMessage);
  const notify = () => toast(notifyMessage);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (notifyMessage != "") notify();
    dispatch(setNotifyMsg(""));
  }, [notifyMessage]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        draggablePercent={22}
        pauseOnHover
        theme="light"
        className="z-5050"
      >
        <p>{notifyMessage}</p>
      </ToastContainer>
    </>
  );
}
