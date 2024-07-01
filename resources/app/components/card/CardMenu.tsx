import React from "react";
import Dropdown from "@/components/dropdown";

function CardMenu(props: {
  transparent?: boolean;
  onDelete: () => void;
  onRename: () => void;
  onDuplicate: () => void;
}) {
  const { transparent, onDelete, onRename, onDuplicate } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <Dropdown
      button={
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center text-xl hover:cursor-pointer ${
            transparent
              ? "bg-none text-white hover:bg-none active:bg-none"
              : "bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
          } linear justify-center rounded-lg font-bold transition duration-200`}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            className="h-6 w-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
          </svg>
        </button>
      }
      childOpenWrapper={open}
      onClosed={setOpen}
      animation={"origin-top-right transition-all duration-300 ease-in-out"}
      classNames={`${transparent ? "top-8" : "top-11"} right-0 w-max`}
      children={
        <div className="z-50 w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p
            onClick={() => {
              setOpen(false);
              onRename();
            }}
            className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium"
          >
            <span>
              <img className="w-4 h-4" src="/assets/icons/icon_edit.png"></img>
            </span>
            Rename
          </p>
          <p
            onClick={() => {
              console.log(open);
              setOpen(false);
              onDuplicate();
            }}
            className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium"
          >
            <span>
              <img
                className="w-4 h-4"
                src="/assets/icons/icon_duplication.png"
              />
            </span>
            Duplicate
          </p>
          <p
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium"
          >
            <span>
              <img className="w-4 h-4" src="/assets/icons/icon_delete.png" />
            </span>
            Delete
          </p>
        </div>
      }
    />
  );
}

export default CardMenu;
