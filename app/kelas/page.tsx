"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Kelas } from "@prisma/client";
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
  const [data, setData] = useState<Kelas[]>([]);
  const [filter, setFilter] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/kelas/api/get`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x);
      });
  };

  const columns: TableColumn<Kelas>[] = [
    {
      name: "No.",
      width: "60px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Kelas",
      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <div className="d-flex">
            <Update reload={reload} kelas={row} />
            <Delete reload={reload} kelas={row} />
          </div>
        </>
      ),
    },
  ];

  const filteredItems = data.filter(
    (item: Kelas) =>
      item.nama && item.nama.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <h4 className="card-title">Data Kelas</h4>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Cari Kelas"
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
                onChangePage={(page) => {
                  setPage(page);
                }}
                onChangeRowsPerPage={(page) => {
                  setPage(1);
                  setPerpage(page);
                }}
              />
            </div>
          </div>
          <Add reload={reload} />
        </div>
      </div>
    </div>
  );
}
