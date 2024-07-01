import PartialLoading from "@/components/PartialLoading";
import axios from "@/service/service";
import { BASE_URL } from "@/service/service";
import { SignInWithTokenAction } from "@/store/actions/auth";
import { useAppDispatch } from "@/store/hooks";
import { setNotifyMsg } from "@/store/reducers/share";
import { useState } from "react";
import { useAsync } from "react-use";

interface Plan {
  id: Number;
  cancelled: Boolean;
  cost: string;
  slug: string;
  ended: Boolean;
  ends_at: any;
  stripe_plan: string;
  subscribed: Boolean;
  title: string;
}

const GoPro = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sub, setSub] = useState(false);
  const dispatch = useAppDispatch();

  useAsync(async () => {
    await getPlans();
  }, []);

  const getPlans = async () => {
    setIsLoading(true);
    const response = await axios.get<Plan[]>(BASE_URL + "/plan/getUserPlans");
    setIsLoading(false);
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length >= 2
    )
      setPlans(response.data);
  };

  const onClickCancel = async () => {
    setSub(true);
    const res = await axios.get(BASE_URL + "/plan/payment-cancel");
    setSub(false);
    if (res.data.success) {
      dispatch(setNotifyMsg(res.data.message));
      await getPlans();
      dispatch(SignInWithTokenAction());
    } else dispatch(setNotifyMsg("Operation Failed."));
  };

  const onClickUpdate = async (plan: string) => {
    setSub(true);
    const res = await axios.get(BASE_URL + "/plan/payment/change/" + plan);
    setSub(false);
    if (res.data.success) {
      dispatch(setNotifyMsg(res.data.message));
      await getPlans();
      dispatch(SignInWithTokenAction());
    } else dispatch(setNotifyMsg("Operation Failed."));
  };

  const onClickRestore = async () => {
    setSub(true);
    const res = await axios.get(BASE_URL + "/plan/payment-restore");
    setSub(false);
    if (res.data.success) {
      dispatch(setNotifyMsg(res.data.message));
      await getPlans();
      dispatch(SignInWithTokenAction());
    } else dispatch(setNotifyMsg("Operation Failed."));
  };

  const renderStatus = (plan: Plan) => {
    return (
      plan["subscribed"] && (
        <div className="absolute right-0 left-0 bg-gray-300 top-5">
          <div className="text-white">
            <div className="bg-blue-700 px-3">
              {plan.cancelled ? "Cancelled" : "Subscribed"}

              {plans[0]["ends_at"] != null && (
                <span className="text-sm">
                  {plans[0]["ended"]
                    ? " / Expired at "
                    : " / Expires at " + plans[0]["ends_at"].split("T")[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    );
  };

  const renderAnnualBtn = (plans: Plan[]) => {
    if (plans[1].subscribed) {
      if (!plans[1].cancelled) {
        if (plans[1].ended) {
          return (
            <a
              href={"pro-plan-annual"}
              className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <i className="fa fa-upload"></i> Upgrade
            </a>
          );
        } else {
          return (
            <button
              onClick={onClickCancel}
              className="mt-10 block w-full rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <i className="fa fa-times-circle"></i> Cancel
            </button>
          );
        }
      } else {
        return (
          <button
            onClick={onClickRestore}
            className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <i className="fa fa-upload"></i> Restore
          </button>
        );
      }
    } else if (plans[0].subscribed) {
      return (
        <button
          onClick={() => onClickUpdate("pro-plan-annual")}
          className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <i className="fa fa-upload"></i> Upgrade
        </button>
      );
    } else {
      return (
        <a
          href={"payment/pro-plan-annual"}
          className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <i className="fa fa-upload"></i> Upgrade
        </a>
      );
    }
  };

  const renderMonthBtn = (plans: Plan[]) => {
    if (plans[0].subscribed) {
      if (!plans[0].cancelled) {
        if (plans[0].ended) {
          return (
            <a
              href={"payment/pro-plan"}
              className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <i className="fa fa-upload"></i>&nbsp;Upgrade
            </a>
          );
        } else {
          return (
            <button
              onClick={onClickCancel}
              className="mt-10 block w-full rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <i className="fa fa-times-circle"></i>&nbsp;Cancel
            </button>
          );
        }
      } else {
        return (
          <button
            onClick={onClickRestore}
            className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <i className="fa fa-upload"></i>&nbsp;Restore
          </button>
        );
      }
    } else if (plans[1].subscribed) {
      if (!plans[1].cancelled) {
        return (
          <button
            onClick={() => onClickUpdate("pro-plan")}
            className="invisible mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <i className="fa fa-download"></i>&nbsp;Downgrade
          </button>
        );
      } else {
        if (plans[1].ended) {
          return (
            <button
              onClick={() => onClickUpdate("pro-plan")}
              className="invisible mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <i className="fa fa-download"></i>&nbsp;Downgrade
            </button>
          );
        } else {
          return (
            <button
              onClick={() => onClickUpdate("pro-plan")}
              className="invisible mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <i className="fa fa-times-circle"></i>&nbsp;Downgrade
            </button>
          );
        }
      }
    } else {
      return (
        <a
          href={"payment/pro-plan"}
          className="mt-10 block w-full rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <i className="fa fa-upload"></i>&nbsp;Upgrade
        </a>
      );
    }
  };

  return (
    <div className="w-full h-full px-2 py-8">
      {!isLoading ? (
        <div className="relative">
          {sub && <PartialLoading />}
          <div className="flex flex-col md:flex-row max-w-md md:max-w-4xl mx-auto my-2 justify-center gap-4">
            <div className="relative rounded-2xl bg-gray-50 py-16 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center">
              {renderStatus(plans[0])}
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  {plans[0].title}
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${plans[0].cost}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    / month
                  </span>
                </p>
                <ul className="mt-6 leading-5 text-gray-600 text-[1em]">
                  <li>ALL Templates (100+)</li>
                  <li>Create Unlimited Graphics</li>
                  <li>PNG, JPG Download</li>
                  <li>Unlimited Saved Designs</li>
                  <li>Custom Image Upload</li>
                </ul>

                {renderMonthBtn(plans)}
              </div>
            </div>
            <div className="relative rounded-2xl bg-gray-50 py-16 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center">
              {renderStatus(plans[1])}
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  {plans[1].title} -{" "}
                  <span className="text-red-400">Save 50%</span>
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${plans[1].cost}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    / year
                  </span>
                </p>
                <ul className="mt-6 leading-5 text-gray-600 text-[1em]">
                  <li>ALL Templates (100+)</li>
                  <li>Create Unlimited Graphics</li>
                  <li>PNG, JPG Download</li>
                  <li>Unlimited Saved Designs</li>
                  <li>Custom Image Upload</li>
                </ul>
                {renderAnnualBtn(plans)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PartialLoading />
      )}
    </div>
  );
};

export default GoPro;
