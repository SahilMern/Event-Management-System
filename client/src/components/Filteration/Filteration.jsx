import React from "react";
import MainContent from "./MainContent";
import FilterationSideBar from "./FilterationSideBar";

const Filteration = () => {
  return (
    <div className="flex w-full">
      <div className="w-1/4 p-4">
        <FilterationSideBar />
      </div>
      <div className="w-3/4 p-4">
        <MainContent />
      </div>
    </div>
  );
};

export default Filteration;
