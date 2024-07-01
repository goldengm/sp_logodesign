import { useState, useEffect, useCallback } from "react";
import TemplateCard from "@/components/card/TemplateCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { LoadTemplateListAction } from "@/store/actions/templates";
import { setCurDesignId, setCurDesignName } from "@/store/reducers/design";
import Banner from "./Banner";
import axios, { BASE_URL } from "@/service/service";
import PartialLoading from "@/components/PartialLoading";
import Pagination from "rc-pagination";
import { useAsync } from "react-use";
import { setNotifyMsg } from "@/store/reducers/share";

const inintalPaginationSettting = {
  current: 1,
  pageSize: 50,
};

interface PaginationDataProp {
  data: any[];
  total: number;
}

const CreateGraphic = () => {
  const navigate = useNavigate();
  // const [searchValue, SetSearchValue] = useState("");
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
    setLoading(true);
    const res = await axios.get(BASE_URL + "/templates/list", {
      params: { ...paginationSetting, search: searchText },
    });
    setLoading(false);
    setPaginatedData(res.data);
  }, [searchText, paginationSetting]);

  // const templateList = useAppSelector((state) => state.templates.templateList);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(LoadTemplateListAction());
  // }, []);

  // const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   SetSearchValue(e.target.value);
  // };

  const onTapTemplate = useCallback(
    (id: number) => {
      dispatch(setCurDesignId(-1));
      dispatch(setCurDesignName(paginatedData.data[id].name));

      axios
        .get(BASE_URL + "/templates/detail/" + paginatedData.data[id].id)
        .then((res) => {
          if (res.data.success) {
            navigate("/user/editor", {
              state: {
                curDesignId: -1,
                curDesignName: res.data.data.name,
                curCategory: res.data.data.category,
                curKeywords: res.data.data.keywords,
                curDescription: res.data.data.description,
                pageData: [JSON.parse(res.data.data.data)],
              },
            });
          }
        })
        .catch((e) => {
          dispatch(setNotifyMsg("Failed to load template."));
        });
    },
    [paginatedData.data]
  );

  return (
    <div className="w-full h-full px-2">
      <Banner
        title="Create a graphic"
        description="Select a preset size or enter a custom graphic dimension to get started"
      />
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

      <div className="relative h-full w-full">
        {/* Main Content */}
        {loading && <PartialLoading />}
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
          <div className="h-full">
            <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {paginatedData.data &&
                paginatedData.data.map((template, index) => {
                  return (
                    <TemplateCard
                      key={index}
                      templateId={index}
                      image={template.img}
                      title={template.name}
                      size={template.layer_size}
                      onClick={onTapTemplate}
                    />
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateGraphic;
