"use client";
import { useState, SyntheticEvent, useRef, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { tampilLoading } from "@/app/helper";
import { resData } from "next-auth";
import { Kelas } from "@prisma/client";

function Update({ reload, kelas }: { reload: Function; kelas: Kelas }) {
  const [nama, setNama] = useState(kelas.nama);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("method", "update");
    formData.append("id", String(kelas.id));
    formData.append("nama", String(nama));
    const x = await axios.patch("/kelas/api/post", formData);
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
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        enforceFocus={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Kelas</Modal.Title>
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
              Update
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
