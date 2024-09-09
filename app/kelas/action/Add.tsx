"use client";
import { useState, SyntheticEvent, useRef, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { tampilLoading } from "@/app/helper";
import { resData } from "next-auth";

function Add({ reload }: { reload: Function }) {
  const [nama, setNama] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function clearForm() {
    setNama("");
  }

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("method", "add");
    formData.append("nama", String(nama));
    const x = await axios.patch("/kelas/api/post", formData);
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
        Tambah Kelas
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
            <Modal.Title>Tambah Kelas</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Nama Kelas</label>
              <div className="col-sm-9">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
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
