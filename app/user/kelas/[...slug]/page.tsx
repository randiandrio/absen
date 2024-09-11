"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Image from "next/image";
import { tampilLoading, tglIndo } from "@/app/helper";
import Add from "../../action/Add";
import { Kelas, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Update from "../../action/update";
import Delete from "../../action/Delete";
import axios from "axios";
import Swal from "sweetalert2";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

export default function UserPage({ params }: { params: { slug: string[] } }) {
  const [kelas, setKelas] = useState(params.slug[0]);
  const [listKelas, setListKelas] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  useEffect(() => {
    loadKelas();
    reload();
  }, []);

  const reload = async () => {
    fetch(`/user/api/get/${params.slug[0]}`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x);
      });
  };

  const loadKelas = async () => {
    fetch(`/user/api/kelas`)
      .then((res) => res.json())
      .then((x) => {
        setListKelas(x);
      });
  };

  const post = async (datas: any[]) => {
    let requestData: any = {
      operator: "AddPersons",
      DeviceID: 2416785,
      Total: data.length,
    };

    for (let i = 0; i < datas.length; i++) {
      requestData[`Personinfo_${i}`] = {
        PersonType: 0,
        Name: datas[i].Name,
        CustomizeID: datas[i].CustomizeID,
        isCheckSimilarity: 0,
        picinfo: datas[i].picinfo,
      };
    }

    const requestDataJson = JSON.stringify(requestData);

    await axios
      .post(`http://192.168.1.10/action/AddPersons`, requestDataJson, {
        timeout: 60000,
        auth: {
          username: "admin",
          password: "admin",
        },
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: "Device tidak ditemukan",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const syncData = async () => {
    setLoading(true);
    fetch(`/user/api/data_user`)
      .then((res) => res.json())
      .then((x: any[]) => {
        var allUser = x.map(function (item) {
          return {
            PersonType: 0,
            Name: item.nama,
            CustomizeID: item.id,
            isCheckSimilarity: 1,
            picinfo: item.picInfo,
          };
        });
        post(allUser);
      });
  };

  const columns: TableColumn<any>[] = [
    {
      name: "",
      width: "100px",
      cell: (row) => (
        <Image
          src={row.picInfo}
          width="60"
          height="60"
          className="rounded-circle my-2"
          alt=""
        />
      ),
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Kelas",
      selector: (row) => String(row.kelas.nama),
      sortable: true,
    },
    {
      name: "Tempat / Tanggal Lahir",
      selector: (row) => `${row.tempatLahir}, ${tglIndo(row.tanggalLahir)}`,
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <div className="d-flex">
            <Update reload={reload} user={row} listKelas={listKelas} />
            <Delete reload={reload} user={row} />
          </div>
        </>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <h4 className="card-title">Data User</h4>

              <div className="col-sm-3 mb-0">
                <select
                  required
                  className="form-control"
                  value={kelas}
                  onChange={(e) => {
                    return router.push(`/user/kelas/${e.target.value}`);
                  }}
                >
                  <option value="All">Semua Kelas</option>
                  {listKelas.map((kelas: Kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive pb-1">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={data}
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
          <div>
            <Add reload={reload} listKelas={listKelas} />
            <button
              onClick={syncData}
              type="button"
              className="btn btn-danger light"
            >
              Sync Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
