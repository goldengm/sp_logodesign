import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useCallback, useMemo, useState, useEffect } from "react";
import axios, { BASE_URL } from "@/service/service";
import { useAsync } from "react-use";
import PartialLoading from "@/components/PartialLoading";
import { useNavigate, useParams } from "react-router-dom";
import TemplateCard from "@/components/card/TemplateCard";
import { useAppDispatch } from "@/store/hooks";
import { SpoofingAction } from "@/store/actions/auth";
import moment from "moment";
import { setNotifyMsg } from "@/store/reducers/share";

const inintalPaginationSettting = {
  current: 1,
  pageSize: 10,
};

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<Boolean>(false);
  const [userData, setUserData] = useState();
  const [paginationSetting, setPaginationSetting] = useState(
    inintalPaginationSettting
  );

  const cancellable = useMemo(() => {
    return (
      userData && userData.active && !userData.ended && !userData.cancelled
    );
  }, [userData]);

  const [renewableDate, setRenewableDate] = useState();

  useEffect(() => {
    if (userData && userData.active && !userData.ended && userData.cancelled) {
      const date =
        userData &&
        userData.ends_at &&
        moment(userData.ends_at.split("T")[0]).format("YYYY-MM-DD");
      setRenewableDate(date);
    } else if (
      userData &&
      userData.active &&
      !userData.ended &&
      !userData.cancelled
    ) {
      const type = userData.plan.slug === "pro-plan" ? "month" : "year";
      const date = moment(userData.sub.created_at.split("T")[0])
        .add(1, type)
        .format("YYYY-MM-DD");
      setRenewableDate(date);
    }
  }, [userData]);

  const dispatch = useAppDispatch();

  const userDesigns = useMemo(() => {
    if (userData) {
      return userData.designs.slice(
        (paginationSetting.current - 1) * paginationSetting.pageSize,
        paginationSetting.current * paginationSetting.pageSize
      );
    } else return [];
  }, [userData, paginationSetting]);

  const onChange = (current: number, pageSize: number) => {
    setPaginationSetting((draft) => ({ ...draft, current, pageSize }));
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaginationSetting((draft) => ({ ...draft, pageSize: e.target.value }));
  };

  const onTapDesign = useCallback(
    (id: number) => {
      if (userData) {
        const pageData = JSON.parse(userData.designs[id].data);
        navigate("/user/editor", {
          state: {
            curDesignId: userData.designs[id].id,
            curDesignName: userData.designs[id].name,
            curCategory: userData.designs[id].category,
            curKeywords: userData.designs[id].keywords,
            curDescription: userData.designs[id].description,
            pageData: pageData,
          },
        });
      }
    },
    [userData]
  );

  const cancelSubscription = (id: string | undefined, renewableDate) => {
    if (id)
      axios
        .post(BASE_URL + "/admin/users/cancelSubscription", {
          subscriptionId: id,
          endAt: renewableDate,
        })
        .then((res) => {
          dispatch(setNotifyMsg(res.data.message));
          makeFetching(id);
        })
        .catch(() => {
          dispatch(setNotifyMsg("Failed to cancel subscription."));
        });
  };

  useAsync(async () => {
    makeFetching(id);
  }, [id]);

  const makeFetching = useCallback(async (id: string | undefined) => {
    setLoading(true);
    const res = await axios.get(BASE_URL + "/admin/users/" + id);
    setLoading(false);
    setUserData(res.data);
  }, []);
  const handleSpoofing = (email: string) => {
    dispatch(SpoofingAction(email, navigate));
  };

  return (
    <div className="w-full p-4 relative">
      {loading && <PartialLoading />}
      <h2 className="text-lg text-bold leading-10">Administration</h2>
      <div className="shadow bg-white">
        <div className="py-2 px-4 border-b border-gray flex justify-between">
          <div className="flex items-center">
            <span>Edit Member - </span>
            <span>{userData && userData.email}</span>
          </div>
          <div>
            <button
              className="bg-teal-600 text-white py-1 px-4 hover:bg-teal-800"
              onClick={() => userData && handleSpoofing(userData.email)}
            >
              Login
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 grid-flow-row gap-4">
            <div>
              <label className="block">Renewable Date</label>
              <div className="border focus:outline-none p-2 w-full h-10">
                <input
                  type="date"
                  disabled={!cancellable}
                  className="w-full focus:outline-none"
                  value={renewableDate}
                  onChange={(e) => {
                    setRenewableDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block">User Joined</label>
              <div className="border focus:outline-none p-2 w-full h-10">
                {userData &&
                  userData.created_at &&
                  moment(userData.created_at.split("T")[0]).format(
                    "YYYY-MM-DD"
                  )}
              </div>
            </div>
            <div>
              <label className="block">Selected Plan</label>
              <div className="border focus:outline-none p-2 w-full h-10">
                {userData &&
                  userData.plan &&
                  (userData.plan.slug === "pro-plan" ? "Monthly" : "Annual")}
              </div>
            </div>
            <div>
              <label className="block">Last Login</label>
              <div className="border focus:outline-none p-2 w-full h-10">
                {userData &&
                  userData.lasttoken &&
                  userData.lasttoken.created_at &&
                  moment(userData.lasttoken.created_at.split("T")[0]).format(
                    "YYYY-MM-DD"
                  )}
              </div>
            </div>
            <div>
              {cancellable && (
                <button
                  className="bg-amber-600 text-white py-1 px-4 hover:bg-amber-800"
                  onClick={() =>
                    cancelSubscription(userData.sub.id, renewableDate)
                  }
                >
                  Cancel Subscription
                </button>
              )}
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <h2 className="text-lg text-bold leading-10">User Designs</h2>
      <div className="shadow bg-white p-4">
        <div className="flex justify-between my-2">
          <Pagination
            onChange={onChange}
            pageSizeOptions={["10", "20", "50", "100"]}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total}`
            }
            total={userData && userData.designs.length}
            {...paginationSetting}
          />
          <select className="border mx-2" onChange={onPageSizeChange}>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          <div className="grow"></div>
        </div>
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {userDesigns.length === 0
            ? "No Data"
            : userDesigns.map((design, index) => (
                <TemplateCard
                  image={design.thumbnail}
                  key={index}
                  templateId={index}
                  title={design.name}
                  size={design.layer_size}
                  onClick={onTapDesign}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
