import React from "react";

const Filtering = ({ filterText, onFilter, onClear, placeholder }) => {
  return (
    <>
      <input
        className="bg-navOp-500 rounded-xl card-shadow text-white"
        id="search"
        type="text"
        placeholder={placeholder}
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <button className="py-2 px-3 bg-danger-500 text-white ml-3 rounded-xl" type="button" onClick={onClear}>
        X
      </button>
    </>
  );
};

export default Filtering;
