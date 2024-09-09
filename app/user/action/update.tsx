"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Image from "next/image";
import { tampilLoading, uploadGambar } from "@/app/helper";
import { Kelas, User } from "@prisma/client";

function Update({
  reload,
  listKelas,
  user,
}: {
  reload: Function;
  listKelas: Kelas[];
  user: User;
}) {
  const [kelasId, setKelasId] = useState(user.kelasId);
  const [nama, setNama] = useState(user.nama);
  const [jenisKelamin, setJenisKelamin] = useState(user.jenisKelamin);
  const [tempatLahir, setTempatLahir] = useState(user.tempatLahir);
  const [tanggalLahir, setTanggalLahir] = useState(user.tanggalLahir);
  const [alamat, setAlamat] = useState(user.alamat);
  const [picInfo, setPicInfo] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [image, setImage] = useState<File>();
  const [fotoUrlSelect, setFotoUrlSelect] = useState("/template/noimage.jpg");
  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const previewGambar = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setFotoUrlSelect(URL.createObjectURL(i));
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("method", "update");
    formData.append("id", String(user.id));
    formData.append("kelasId", String(kelasId));
    formData.append("nama", String(nama));
    formData.append("jenisKelamin", String(jenisKelamin));
    formData.append("tempatLahir", String(tempatLahir));
    formData.append("tanggalLahir", String(tanggalLahir));
    formData.append("alamat", String(alamat));
    // formData.append("picInfo", String(picInfo));
    const x = await axios.patch("/user/api/post", formData);
    const pesan = (await x.data) as resData;

    if (!pesan.error) {
      handleClose();
      reload();
    }

    setPost(false);
    Swal.fire({
      title: "Success",
      text: String(pesan.message),
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-info shadow btn-xs sharp mx-1"
      >
        <i className="fa fa-edit"></i>
      </span>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambahkan User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Nama</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Kelas</label>
              <div className="col-sm-8">
                <select
                  required
                  placeholder="Pilih Kelas"
                  className="form-control"
                  value={Number(kelasId)}
                  onChange={(e) => {
                    setKelasId(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Kelas</option>
                  {listKelas.map((kelas: Kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Jenis Kelamin</label>
              <div className="col-sm-8">
                <select
                  required
                  placeholder="Pilih Kelas"
                  className="form-control"
                  value={jenisKelamin}
                  onChange={(e) => {
                    setJenisKelamin(e.target.value);
                  }}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Tempat Lahir</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Tanggal Lahir</label>
              <div className="col-sm-8">
                <input
                  required
                  type="date"
                  className="form-control"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Alamat</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-danger light"
              onClick={handleClose}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary light">
              Simpan
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
