import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useState } from "react";
import axios, { BASE_URL } from "@/service/service";
import { useAsync } from "react-use";
import PartialLoading from "@/components/PartialLoading";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { SpoofingAction } from "@/store/actions/auth";
import ThSort from "@/components/ThSort";

const inintalPaginationSettting = {
  current: 1,
  pageSize: 10,
};

interface PaginationDataProp {
  data: any[];
  total: number;
}

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sorter, setSorter] = useState({ field: "id", direction: true });
  const [loading, setLoading] = useState<Boolean>(false);
  const [paginatedData, setPaginatedData] = useState<PaginationDataProp>({
    data: [],
    total: 0,
  });
  const [paginationSetting, setPaginationSetting] = useState(
    inintalPaginationSettting
  );
  const [searchText, setSearchText] = useState("");
  const onChange = (current: number, pageSize: number) => {
    setPaginationSetting((draft) => ({ ...draft, current, pageSize }));
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaginationSetting((draft) => ({ ...draft, pageSize: e.target.value }));
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSpoofing = (email: string) => {
    dispatch(SpoofingAction(email, navigate));
  };

  const onClickHeader = (field: string) => {
    if (sorter.field === field) {
      setSorter((draft) => ({ ...draft, direction: !draft.direction }));
    } else {
      setSorter(() => ({ field, direction: 1 }));
    }
  };

  useAsync(async () => {
    setLoading(true);
    const res = await axios.get(BASE_URL + "/admin/users", {
      params: { ...paginationSetting, search: searchText, ...sorter },
    });
    setLoading(false);
    setPaginatedData(res.data);
  }, [searchText, paginationSetting, sorter]);

  return (
    <div className="w-full p-4 relative">
      {loading && <PartialLoading />}
      <div className="flex justify-between">
        <Pagination
          onChange={onChange}
          pageSizeOptions={["10", "20", "50", "100"]}
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`
          }
          total={paginatedData && paginatedData.total}
          {...paginationSetting}
        />
        <select className="border mx-2" onChange={onPageSizeChange}>
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
        <div className="grow"></div>
        <input
          className="border focus:outline-none px-2"
          placeholder="Please input search."
          onChange={onSearch}
        />
      </div>

      <table className="w-full text-left mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">
              <ThSort
                sorter={sorter}
                field={"id"}
                label={"User Id"}
                onClick={onClickHeader}
              />
            </th>
            <th className="p-2">
              <ThSort
                sorter={sorter}
                field={"email"}
                label={"Email"}
                onClick={onClickHeader}
              />
            </th>
            <th className="p-2">
              <ThSort
                sorter={sorter}
                field={"designs_count"}
                label={"Designs"}
                onClick={onClickHeader}
              />
            </th>
            <th className="p-2">
              <ThSort
                sorter={sorter}
                field={"last_login"}
                label={"LastLogin"}
                onClick={onClickHeader}
              />
            </th>
            <th className="p-2">
              <ThSort
                sorter={sorter}
                field={"plan_name"}
                label={"Plan"}
                onClick={onClickHeader}
              />
            </th>
            <th className="p-2">Login</th>
            <th className="p-2">Edit</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.data &&
            paginatedData.data.map((item, i) => (
              <tr key={item.id} className={`${i % 2 ? "bg-gray-50" : ""}`}>
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.email}</td>
                <td className="p-2">{item.designs_count}</td>
                <td className="p-2">
                  {item.last_login &&
                    moment(item.last_login).format("YYYY-MM-DD hh:mm:ss")}
                </td>
                <td className="p-2">{item.plan_name}</td>
                <td className="p-2">
                  <button
                    className="bg-teal-600 text-white px-4 hover:bg-teal-800"
                    onClick={() => handleSpoofing(item.email)}
                  >
                    Login
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className="bg-amber-600 text-white px-4 hover:bg-amber-800"
                    onClick={() => navigate("/admin/users/edit/" + item.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
