import { useState } from "react";
import Card from "@/components/card";
import CardMenu from "@/components/card/CardMenu";
import LazyImage from "../LazyImage";

const DesignCard = (props: {
  image: string;
  title: string;
  size: string;
  designId: number;
  extra?: string;
  hideContextMenu?: boolean;
  onClick: (id: number) => void;
  onDelete: (id: number) => void;
  onRename: (id: number) => void;
  onDuplicate: (id: number) => void;
}) => {
  const {
    title,
    designId,
    size,
    image,
    extra,
    hideContextMenu,
    onClick,
    onDelete,
    onRename,
    onDuplicate,
  } = props;

  return (
    <Card
      extra={` flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div
          className="hover:cursor-pointer relative w-full "
          onClick={() => onClick(designId)}
        >
          <LazyImage
            src={image}
            className="mb-3 h-full w-full rounded-md 3xl:h-full 3xl:w-full"
            alt=""
          />
        </div>

        <div className="mb-2 flex items-center justify-between px-1 md:flex-row md:items-start lg:flex-row lg:justify-between xl:flex-row xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {title}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
              {size}
            </p>
          </div>
          <div className="flex flex-row-reverse md:mt-2 lg:mt-0">
            {!hideContextMenu && (
              <CardMenu
                onDelete={() => onDelete(designId)}
                onRename={() => onRename(designId)}
                onDuplicate={() => onDuplicate(designId)}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DesignCard;
