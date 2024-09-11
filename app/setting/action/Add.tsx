"use client";
import { useState, SyntheticEvent, useRef, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { tampilLoading } from "@/app/helper";
import { resData } from "next-auth";

function Add({ reload }: { reload: Function }) {
  const [hari, setHari] = useState("");
  const [awal, setAwal] = useState("");
  const [akhir, setAkhir] = useState("");
  const [pulang, setPulang] = useState("");
  const [terlambat, setTerlambat] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function clearForm() {
    setHari("");
    setAwal("");
    setAkhir("");
    setPulang("");
    setTerlambat("");
  }

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("hari", String(hari));
    formData.append("awal", String(awal));
    formData.append("akhir", String(akhir));
    formData.append("pulang", String(pulang));
    formData.append("terlambat", String(terlambat));
    const x = await axios.patch("/setting/api/post", formData);
    const pesan = (await x.data) as resData;

    if (!pesan.error) {
      clearForm();
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
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light mb-2"
      >
        Tambah Setting
      </button>

      <Modal
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        enforceFocus={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Setting</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row mb-3">
              <label className="col-sm-5 col-form-label">Hari</label>
              <div className="col-sm-7">
                <select
                  required
                  className="form-control"
                  value={hari}
                  onChange={(e) => {
                    setHari(e.target.value);
                  }}
                >
                  <option value="">Pilih Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-5 col-form-label">
                Mulai absen masuk
              </label>
              <div className="col-sm-7">
                <input
                  required
                  type="time"
                  className="form-control"
                  value={awal}
                  onChange={(e) => setAwal(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-5 col-form-label">
                Akhir absen masuk
              </label>
              <div className="col-sm-7">
                <input
                  required
                  type="time"
                  className="form-control"
                  value={akhir}
                  onChange={(e) => setAkhir(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-5 col-form-label">Absen Pulang</label>
              <div className="col-sm-7">
                <input
                  required
                  type="time"
                  className="form-control"
                  value={pulang}
                  onChange={(e) => setPulang(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-5 col-form-label">
                Toleransi Keterlambatan (menit)
              </label>
              <div className="col-sm-7">
                <input
                  required
                  type="number"
                  className="form-control"
                  value={terlambat}
                  onChange={(e) => setTerlambat(e.target.value)}
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

export default Add;
