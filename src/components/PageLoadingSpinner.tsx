import Spinner from "./Spinner";

const PageLoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary-100 bg-opacity-80 z-50">
      <Spinner className="size-12 text-primary-400"/>
    </div>
  );
};

export default PageLoadingSpinner;
