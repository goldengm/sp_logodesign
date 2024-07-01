import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DesignCard from "@/components/card/DesignCard";
import ModalDialog from "@/components/modal";
import Banner from "./Banner";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  LoadDesignAction,
  DeleteDesignAction,
  RenameDesignAction,
  DuplicateDesignAction,
} from "@/store/actions/design";
import { setCurDesignId, setCurDesignName } from "@/store/reducers/design";
import InputField from "@/components/fields/InputField";
import {
  IFieldObject,
  useReactForm,
} from "@surinderlohat/react-form-validation";
import { useAsync } from "react-use";
import axios, { BASE_URL } from "@/service/service";
import Pagination from "rc-pagination";
import PartialLoading from "@/components/PartialLoading";
import { setNotifyMsg } from "@/store/reducers/share";

const field: IFieldObject = {
  designName: {
    label: "Design Name",
    placeholder: "Enter your design name.",
    rules: [{ rule: "required", message: "This field is required" }],
  },
};

const inintalPaginationSettting = {
  current: 1,
  pageSize: 50,
};

interface PaginationDataProp {
  data: any[];
  total: number;
}

interface PaginationSettingProp {
  current: number;
  pageSize: number;
}

const SavedGraphics = () => {
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

  useAsync(async () => {
    makeFetching(paginationSetting, searchText);
  }, [searchText, paginationSetting]);

  const makeFetching = useCallback(
    async (paginationSetting: PaginationSettingProp, searchText: string) => {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/design/list", {
        params: { ...paginationSetting, search: searchText },
      });
      setLoading(false);
      setPaginatedData(res.data);
    },
    []
  );

  // const [bOpen, setOpen] = useState(true);
  // const category = ["Sample1", "Sample2", "Sample3"];
  // const [searchValue, SetSearchValue] = useState("");
  const [selDesignId, setSelDesignId] = useState(-1);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  // const designList = useAppSelector((state) => state.designs.designList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const changeForm = useReactForm(field);

  // useEffect(() => {
  //   dispatch(LoadDesignAction());
  // }, []);

  const onTapDesign = useCallback(
    (id: number) => {
      dispatch(setCurDesignId(paginatedData.data[id].id));
      dispatch(setCurDesignName(paginatedData.data[id].name));
      axios
        .get(BASE_URL + "/design/detail/" + paginatedData.data[id].id)
        .then((res) => {
          if (res.data.success) {
            navigate("/user/editor", {
              state: {
                curDesignId: res.data.data.id,
                curDesignName: res.data.data.name,
                curCategory: res.data.data.category,
                curKeywords: res.data.data.keywords,
                curDescription: res.data.data.description,
                pageData: JSON.parse(res.data.data.data),
              },
            });
          }
        })
        .catch((e) => {
          dispatch(setNotifyMsg("Failed to load design."));
        });
    },
    [paginatedData.data]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setSelDesignId(paginatedData.data[id].id);
      setOpenDeleteConfirm(true);
    },
    [paginatedData.data]
  );

  const handleConfirmDelete = useCallback(() => {
    setOpenDeleteConfirm(false);
    dispatch(DeleteDesignAction(selDesignId)).then(() => {
      makeFetching(paginationSetting, searchText);
    });
  }, [paginationSetting, searchText, selDesignId]);

  const handleDuplicate = useCallback(
    (id: number) => {
      dispatch(DuplicateDesignAction(paginatedData.data[id].id)).then(() => {
        makeFetching(paginationSetting, searchText);
      });
    },
    [paginatedData.data, paginationSetting, searchText]
  );

  const handleRename = useCallback(
    (id: number) => {
      changeForm.getField("designName").setValue(paginatedData.data[id].name);
      setSelDesignId(paginatedData.data[id].id);
      setOpenChangeName(true);
    },
    [paginatedData.data]
  );

  const handleChangeDesignName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      dispatch(
        RenameDesignAction(
          selDesignId,
          changeForm.getField("designName").getValue()
        )
      ).then(() => {
        makeFetching(paginationSetting, searchText);
      });
      setOpenChangeName(false);
    },
    [paginationSetting, searchText, selDesignId, changeForm]
  );

  // const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   SetSearchValue(e.target.value);
  // };
  return (
    <div className="w-full h-full px-2">
      <Banner title="Saved Graphics" description="" />
      <div className="flex justify-between items-center">
        <div className="flex h-[40px] mb-4 mt-4 items-center rounded-full bg-lightPrimary text-navy-70">
          <p className="pl-3 pr-2 text-xl">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-gray-400 dark:text-white"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-64 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400"
            onChange={onSearch}
          />
        </div>
        <Pagination
          onChange={onChange}
          pageSizeOptions={["10", "20", "50", "100"]}
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`
          }
          total={paginatedData && paginatedData.total}
          {...paginationSetting}
        />
      </div>
      <div className="h-full w-full md:col-span-10 ">
        {/* Main Content */}
        {loading && <PartialLoading />}

        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
          <div className="h-full">
            <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {paginatedData.data &&
                paginatedData.data.map((design, index) => (
                  <DesignCard
                    image={design.thumbnail}
                    key={index}
                    designId={index}
                    title={design.name}
                    size={design.layer_size}
                    onClick={onTapDesign}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                  />
                ))}
            </div>
          </div>
        </main>
      </div>
      <ModalDialog
        open={openChangeName}
        onClosed={setOpenChangeName}
        children={
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Change Design Name
            </h3>
            <form className="space-y-6" action="#">
              <div>
                <InputField
                  extra="mb-3"
                  key={"designName"}
                  field={changeForm.getField("designName")}
                  showLabel={true}
                />
              </div>
              <button
                onClick={handleChangeDesignName}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Change
              </button>
            </form>
          </div>
        }
      />
      <ModalDialog
        open={openDeleteConfirm}
        onClosed={setOpenDeleteConfirm}
        children={
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Confirmation
            </h3>
            <p> Do you want to delete this design?</p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={handleConfirmDelete}
                className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenDeleteConfirm(false)}
                className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                No
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SavedGraphics;
