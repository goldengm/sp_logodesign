import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderLayout from "../../../template-editor/layout/HeaderLayout";
import Sidebar from "../../../template-editor/layout/Sidebar";
import EditorContent from "../../../template-editor/pages/EditorContent";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import ModalDialog from "@/components/modal";
import axios from "@/service/service";
import { isArray } from "lodash";
import AppLayerSettings from "../../../template-editor/layout/AppLayerSettings";
import { Editor, GetFontQuery, PageControl } from "@lidojs/editor";
import { FontData } from "@lidojs/core";
import {
  IFieldObject,
  useReactForm,
} from "@surinderlohat/react-form-validation";
import InputField from "@/components/fields/InputField";
import { setCurDesignName, setCurDesignId } from "@/store/reducers/design";
import { setCurCategory } from "@/store/reducers/design";
import { setCurKeywords } from "@/store/reducers/design";
import { setCurDescription } from "@/store/reducers/design";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import TextareaField from "@/components/fields/TextareaField";

const field: IFieldObject = {
  designName: {
    label: "Design Name",
    placeholder: "Enter your design name.",
    rules: [{ rule: "required", message: "This field is required" }],
  },
  description: {
    label: "Description",
    placeholder: "Enter your design description.",
    rules: [],
  },
};

export default function TemplateEditorHome() {
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const [openChangeName, setOpenChangeName] = useState(false);
  const changeForm = useReactForm(field);
  const location = useLocation();
  const {
    state: {
      pageData,
      curDesignId: oId,
      curDesignName: oName,
      curCategory: oCategory,
      curKeywords: oKeywords,
      curDescription: oDescription,
    },
  } = location;
  useEffect(() => {
    dispatch(setCurDesignId(oId));
    dispatch(setCurDesignName(oName));
    dispatch(setCurCategory(oCategory));
    dispatch(setCurKeywords(oKeywords));
    dispatch(setCurDescription(oDescription));
  }, []);

  const curDesignId = useAppSelector((state) => state.designs.curDesignId);
  const curDesignName = useAppSelector(
    (state) => state.designs.curDesignName || "New Template"
  );
  const curCategory = useAppSelector(
    (state) => state.designs.curCategory || ""
  );
  const curKeywords = useAppSelector(
    (state) => state.designs.curKeywords || ""
  );
  const curDescription = useAppSelector(
    (state) => state.designs.curDescription || ""
  );

  const dispatch = useAppDispatch();

  const getFonts = useCallback((query: GetFontQuery) => {
    const buildParams = (data: Record<string, string | string[]>) => {
      const params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      });

      return params;
    };
    return axios
      .get<FontData[]>(`/api/v1/fonts?${buildParams(query)}`)
      .then((res) => res.data);
  }, []);

  const [viewPortHeight, setViewPortHeight] = useState<number>();

  useEffect(() => {
    const windowHeight = () => {
      setViewPortHeight(window.innerHeight);
    };
    window.addEventListener("resize", windowHeight);
    windowHeight();
    return () => {
      window.removeEventListener("resize", windowHeight);
    };
  }, []);

  const handleChangeDesignName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const valid = Object.values(changeForm.getErrors()).every(
        (v) => v === ""
      );
      if (valid) {
        dispatch(
          setCurDesignName(changeForm.getField("designName").getValue())
        );
        dispatch(
          setCurDescription(changeForm.getField("description").getValue())
        );
        setOpenChangeName(false);
      }
    },
    [changeForm]
  );

  return (
    <div className="block relative">
      <Editor
        config={{
          assetPath: "/assets",
          frame: {
            defaultImage: {
              url: `/assets/images/frame-placeholder.png`,
              width: 1200,
              height: 800,
            },
          },
        }}
        getFonts={getFonts}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            maxHeight: viewPortHeight ? `${viewPortHeight}px` : "auto",
          }}
        >
          <HeaderLayout
            curDesignName={curDesignName}
            openChangeName={() => {
              changeForm.getField("designName").setValue(curDesignName);
              changeForm.getField("description").setValue(curDescription);
              setOpenChangeName(true);
            }}
          />
          <div className="flex justify-around py-2 border-b-2">
            <div className="flex gap-2 justify-center items-center">
              <label>Category</label>
              <Select
                className="w-64"
                placeholder="Select Category."
                value={{ value: curCategory, label: curCategory }}
                onChange={(o) => {
                  dispatch(setCurCategory(o?.value));
                }}
                options={[
                  { value: "", label: "-- Select --" },
                  { value: "Retail", label: "Retail" },
                  { value: "Restaurant", label: "Restaurant" },
                  { value: "Utility", label: "Utility" },
                  { value: "Healthcare", label: "Healthcare" },
                  { value: "Auto", label: "Auto" },
                  { value: "Business Service", label: "Business Service" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <label>Keywords</label>
              <CreatableSelect
                placeholder="Input Keywords."
                className="w-96"
                value={
                  !curKeywords || curKeywords === ""
                    ? []
                    : curKeywords
                        .split(",")
                        .map((t: string) => ({ value: t, label: t }))
                }
                onChange={(o) => {
                  dispatch(
                    setCurKeywords(o.map(({ value }) => value).join(","))
                  );
                }}
                isMulti
              />
            </div>
          </div>
          <div
            css={{
              display: "flex",
              flexDirection: "row",
              flex: "auto",
              overflow: "auto",
              background: "#EBECF0",
              "@media (max-width: 900px)": {
                flexDirection: "column-reverse",
              },
            }}
          >
            <div
              ref={leftSidebarRef}
              css={{
                display: "flex",
                background: "white",
              }}
            >
              <Sidebar />
            </div>
            <div
              css={{
                flexGrow: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
              }}
            >
              <AppLayerSettings />
              <div
                css={{
                  flexGrow: 1,
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <EditorContent
                  id={curDesignId}
                  pageData={pageData}
                  designName={curDesignName}
                  category={curCategory}
                  keywords={curKeywords}
                  description={curDescription}
                />
              </div>
              <div
                css={{
                  height: 40,
                  background: "#fff",
                  borderTop: "1px solid rgba(57,76,96,.15)",
                  display: "grid",
                  alignItems: "center",
                  flexShrink: 0,
                  "@media (max-width: 900px)": {
                    display: "none",
                  },
                }}
              >
                <PageControl />
              </div>
            </div>
          </div>
        </div>
      </Editor>
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
              <div>
                <TextareaField
                  extra="mb-3"
                  key={"description"}
                  field={changeForm.getField("description")}
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
    </div>
  );
}
