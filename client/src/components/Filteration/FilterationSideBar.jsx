import React from "react";

const FilterationSideBar = () => {
  return (
    <div className="border border-gray-200 shadow-md p-6 flex flex-col space-y-6 rounded-md bg-white">
      {/* Color Filter */}
      <div>
        <p className="text-lg font-semibold text-gray-800">Color</p>
        <div className="mt-2">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="color-red"
              className="h-5 w-5 border-gray-300 rounded-md"
            />
            <label htmlFor="color-red" className="text-gray-700">
              Red
            </label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="color-blue"
              className="h-5 w-5 border-gray-300 rounded-md"
            />
            <label htmlFor="color-blue" className="text-gray-700">
              Blue
            </label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="color-green"
              className="h-5 w-5 border-gray-300 rounded-md"
            />
            <label htmlFor="color-green" className="text-gray-700">
              Green
            </label>
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <p className="text-lg font-semibold text-gray-800">Size</p>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="size"
            className="h-5 w-5 border-gray-300 rounded-md"
          />
          <label htmlFor="size" className="text-gray-700">
            Large
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="size"
            className="h-5 w-5 border-gray-300 rounded-md"
          />
          <label htmlFor="size" className="text-gray-700">
            Medium
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="size"
            className="h-5 w-5 border-gray-300 rounded-md"
          />
          <label htmlFor="size" className="text-gray-700">
            Small
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-lg font-semibold text-gray-800">Price Range</p>
        <input
          type="range"
          min="0"
          max="100"
          className="w-full h-2 bg-blue-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-gray-600">
          <span>$0</span>
          <span>$100</span>
        </div>
      </div>
    </div>
  );
};

export default FilterationSideBar;
