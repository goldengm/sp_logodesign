import SpinnerIcon from "@duyank/icons/regular/Spinner";

export default function PartialLoading() {
  return (
    <div className="absolute right-0 left-0 top-0 bottom-0 z-50 flex items-center justify-center bg-bgOverlay">
      <div className="flex items-center">
        <SpinnerIcon className="animate-spin" />
        Processing
      </div>
    </div>
  );
}
