"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Device } from "@prisma/client";
import Update from "./action/update";
import Delete from "./action/Delete";
import Add from "./action/Add";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

export default function InfoPage() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Device[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/device/api/get`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x);
      });
  };

  const columns: TableColumn<Device>[] = [
    {
      name: "ID Device",
      selector: (row) => String(row.deviceID),
      sortable: true,
    },
    {
      name: "IP Device",
      selector: (row) => String(row.deviceIP),
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <div className="d-flex">
            <Update reload={reload} device={row} />
            <Delete reload={reload} device={row} />
          </div>
        </>
      ),
    },
  ];

  const filteredItems = data.filter(
    (item: Device) =>
      item.deviceID &&
      item.deviceIP.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <h4 className="card-title">Data Device</h4>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Cari Device"
                />
              </div>
            </div>

            <div className="table-responsive pb-1">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={filteredItems}
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
          <Add reload={reload} />
        </div>
      </div>
    </div>
  );
}
