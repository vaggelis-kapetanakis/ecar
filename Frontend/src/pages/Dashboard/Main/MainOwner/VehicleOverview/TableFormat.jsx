import React, { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import Filtering from "../../../../../shared/utils/tableUtils/Filtering";
import styles from "../../../../../style";

createTheme("dark", {
  background: {
    default: "transparent",
  },
  divider: {
    default: "#073642",
  },
  button: {
    default: "#2aa198",
    hover: "rgba(0,0,0,.08)",
    focus: "rgba(255,255,255,.12)",
    disabled: "rgba(255, 255, 255, .34)",
  },
  sortFocus: {
    default: "#2aa198",
  },
  text: {
    primary: "#ffffff",
    secondary: "#2aa198",
  },
});

const customStyles = {
  rows: {
    style: {
      minHeight: "56px", // override the row height
    },
  },
  headCells: {
    style: {
      fontSize: "16px",
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

const TableFormat = ({ tableData, handleSorting }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const columns = [
    {
      name: "Id",
      id: "id",
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      sticky: true,
      selector: (row) => row.id,
      sortable: true,
    },

    {
      name: "Vehicle ID",
      id: "vehicleId",
      width: "300px",
      maxWidth: "300px",
      minWidth: "300px",
      selector: (row) => row.vehicleId,
    },
    {
      name: "Brand",
      id: "brand",
      filterable: false,
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Type",
      id: "type",
      filterable: false,
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Model",
      id: "model",
      filterable: false,
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Avg. Consumption",
      id: "average_consumption",
      filterable: false,
      selector: (row) => row.average_consumption,
      sortable: true,
    },
    {
      name: "Release Year",
      id: "release_year",
      selector: (row) => row.release_year,
      sortable: true,
    },
  ];

  const filteredItems = tableData.filter(
    (item) =>
      item.model && item.model.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <div className="w-full flex items-center pr-5 justify-between pb-5">
        <h1 className={`${styles.respFontSmall} font-bold text-white`}>
          Your Vehicles
        </h1>
        <div>
          <Filtering
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
            placeholder="Filter By Model"
          />
        </div>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const paginationComponentOptions = {
    noRowsPerPage: true,
    selectAllRowsItem: false,
  };

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        theme="dark"
        customStyles={customStyles}
      />
    </div>
  );
};

export default TableFormat;
