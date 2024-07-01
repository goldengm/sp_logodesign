import { useCallback, useMemo } from "react";
import { DesignFrame } from "@lidojs/editor";
import { useEditor } from "@lidojs/editor";
import { SaveDesignAction } from "@/store/actions/design";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getWaterMarkedData, sampleData } from "../data";

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

  console.log(curDesignId);
  const subscribed = useAppSelector(
    (state) =>
      state.auth.authUser &&
      state.auth.authUser.active &&
      !state.auth.authUser.ended
  );

  const saveThumbnail = useCallback(
    (thumbnailImg: Blob | null) => {
      let q = JSON.parse(JSON.stringify(query.serialize()));
      for (let i = 0; i < q.length; i++) {
        Object.keys(q[i].layers).forEach((id) => {
          if (q[i].layers[id].waterMark) {
            delete q[i].layers[id];
            q[i].layers.ROOT.child = q[i].layers.ROOT.child.filter(
              (k: string) => k !== id
            );
          }
        });
      }
      dispatch(
        SaveDesignAction(
          curDesignId,
          curDesignName,
          curCategory,
          curKeywords,
          curDescription,
          thumbnailImg,
          q
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
    const d = pageData || sampleData;
    return !subscribed ? getWaterMarkedData(JSON.parse(JSON.stringify(d))) : d;
  }, [subscribed, pageData]);

  return <DesignFrame data={data} onSavedThumbnail={saveThumbnail} />;
};

export default EditorContent;
