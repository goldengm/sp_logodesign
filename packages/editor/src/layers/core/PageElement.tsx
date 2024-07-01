import { FC } from "react";
import LayerElement from "./LayerElement";

export const PageElement: FC = () => {
  return (
    <div>
      <LayerElement id={"ROOT"} />
    </div>
  );
};

export default PageElement;
