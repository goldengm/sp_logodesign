import { useCallback, useMemo } from "react";
import { DesignFrame } from "@lidojs/editor";
import { useEditor } from "@lidojs/editor";
import { useAppDispatch } from "@/store/hooks";
import { sampleData } from "../data";
import { SaveTemplateAction } from "@/store/actions/templates";

const EditorContent = (props: {
  pageData?: any;
  id: number;
  designName: string;
  category: string;
  keywords: string;
  description: string;
}) => {
  const { pageData } = props;
  const { query } = useEditor();
  const dispatch = useAppDispatch();

  const curDesignId = props.id;
  const curDesignName = props.designName;
  const curCategory = props.category;
  const curKeywords = props.keywords;
  const curDescription = props.description;
  // const curDesignId = useAppSelector((state) => state.designs.curDesignId);
  // const curDesignName = useAppSelector((state) => state.designs.curDesignName);

  const saveThumbnail = useCallback(
    (thumbnailImg: Blob | null) => {
      let q = JSON.parse(JSON.stringify(query.serialize()));

      Object.keys(q[0].layers).forEach((id) => {
        if (q[0].layers[id].waterMark) {
          delete q[0].layers[id];
          q[0].layers.ROOT.child = q[0].layers.ROOT.child.filter(
            (k: string) => k !== id
          );
        }
      });

      dispatch(
        SaveTemplateAction(
          curDesignId,
          curDesignName,
          curCategory,
          curKeywords,
          curDescription,
          thumbnailImg,
          q[0]
        )
      );
    },
    [
      curDesignId,
      curDesignName,
      curCategory,
      curKeywords,
      curDescription,
      query,
    ]
  );

  const data = useMemo(() => {
    return pageData || sampleData;
  }, [pageData]);

  return <DesignFrame data={data} onSavedThumbnail={saveThumbnail} />;
};

export default EditorContent;
