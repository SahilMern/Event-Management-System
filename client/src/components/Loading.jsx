import { InfinitySpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <InfinitySpin
        visible={true}
        width="200"
        color="#000"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
};

export default Loading;