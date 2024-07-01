import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderLayout from "../../editor/layout/HeaderLayout";
import Sidebar from "../../editor/layout/Sidebar";
import EditorContent from "../../editor/pages/EditorContent";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import ModalDialog from "@/components/modal";
import axios from "@/service/service";
import { isArray } from "lodash";
import AppLayerSettings from "../../editor/layout/AppLayerSettings";
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

const field: IFieldObject = {
  designName: {
    label: "Design Name",
    placeholder: "Enter your design name.",
    rules: [{ rule: "required", message: "This field is required" }],
  },
};

export default function EditorHome() {
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
  const curDesignName = useAppSelector((state) => state.designs.curDesignName);
  const curCategory = useAppSelector((state) => state.designs.curCategory);
  const curKeywords = useAppSelector((state) => state.designs.curKeywords);
  const curDescription = useAppSelector(
    (state) => state.designs.curDescription
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
      setViewPortHeight(window.innerHeight - 80);
    };
    window.addEventListener("resize", windowHeight);
    windowHeight();
    return () => {
      window.removeEventListener("resize", windowHeight);
    };
  }, []);

  const handleChangeDesignName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setCurDesignName(changeForm.getField("designName").getValue()));
    setOpenChangeName(false);
  };

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
              setOpenChangeName(true);
            }}
          />
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
