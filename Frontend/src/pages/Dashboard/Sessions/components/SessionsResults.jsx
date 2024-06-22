import React, { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import Filtering from "../../../../shared/utils/tableUtils/Filtering";
import {
  ExportToExcel,
  downloadCSV,
} from "../../../../shared/utils/tableUtils/ExportToExcel";

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

const SessionsResults = ({ formData }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const columns = [
    {
      name: "Index",
      id: "SessionIndex",
      sticky: true,
      Color: "#0779e4",
      width: "100px",
      maxWidth: "100px",
      minWidth: "100px",
      selector: (row) => row.SessionIndex,
      sortable: true,
    },
    {
      name: "Energy Provider",
      id: "EnergyProvider",
      selector: (row) => row.EnergyProvider,
      sortable: true,
    },
    {
      name: "Energy Delivered (kWh)",
      id: "EnergyDelivered",
      filterable: false,
      selector: (row) => row.EnergyDelivered,
      sortable: true,
    },
    {
      name: "Cost Per kWh",
      id: "CostPerKWh",
      filterable: false,
      selector: (row) => row.CostPerKWh,
      sortable: true,
    },
    {
      name: "Session Cost",
      id: "SessionCost",
      filterable: false,
      selector: (row) => `${row.SessionCost} €`,
      sortable: true,
    },
    /* {
      name: "Started On",
      id: "StartedOn",
      filterable: false,
      selector: (row) => row.StartedOn,
      sortable: true,
    }, */
    /* {
      name: "Finished On",
      id: "FinishedOn",
      selector: (row) => `${row.StartedOn} - ${row.FinishedOn}`,
      sortable: true,
    }, */
    {
      name: "Time Charging",
      id: "timeCharging",
      selector: (row) => row.timeCharging,
      sortable: true,
    },
  ];

  const filteredItems = formData.records.filter(
    (item) =>
      item.EnergyProvider &&
      item.EnergyProvider.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <Filtering
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        placeholder="Filter By Energy Provider"
      />
    );
  }, [filterText, resetPaginationToggle]);

  const paginationComponentOptions = {
    noRowsPerPage: true,
    selectAllRowsItem: false,
  };

  const actionsMemo = React.useMemo(
    () => <ExportToExcel onExport={() => downloadCSV(filteredItems)} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="xl:h-[70vh] xxs:h-[100vh] px-3">
      {/* {console.log(formData)} */}
      <DataTable
        title="Vehicle Results"
        columns={columns}
        data={filteredItems}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        paginationRowsPerPageOptions={[2,4,8]}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        actions={actionsMemo}
        theme="dark"
        customStyles={customStyles}
      />
    </div>
  );
};

export default SessionsResults;
