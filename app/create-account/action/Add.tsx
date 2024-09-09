"use client";
import { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";

function Add() {
  const [namaSekolah, setaNamaSekolah] = useState("");
  const [namaAdmin, setNamaAdmin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang mengirim data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();

  function clearForm() {
    setaNamaSekolah("");
    setNamaAdmin("");
    setUsername("");
    setPassword("");
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("namaSekolah", String(namaSekolah));
    formData.append("namaAdmin", String(namaAdmin));
    formData.append("username", String(username));
    formData.append("password", String(password));
    const x = await axios.patch("/create-account/api/post_app", formData);
    const pesan = (await x.data) as resData;

    setIsLoading(false);

    if (!pesan.error) {
      clearForm();
      handleClose();
    }

    Swal.fire({
      title: pesan.error ? "Error" : "Success!",
      text: String(pesan.message),
      icon: pesan.error ? "error" : "success",
      showConfirmButton: false,
      timer: 1500,
    });
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light mb-2"
      >
        Tambah Sekolah
      </button>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Data Sekolah</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Nama Sekolah</label>
              <div className="col-sm-9">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={namaSekolah}
                  onChange={(e) => setaNamaSekolah(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Nama Admin</label>
              <div className="col-sm-9">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={namaAdmin}
                  onChange={(e) => setNamaAdmin(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Username</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Password</label>
              <div className="col-sm-9">
                <input
                  required
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
