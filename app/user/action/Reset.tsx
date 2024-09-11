"use client";
import { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { User } from "@prisma/client";

function Reset() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isPost, setPost] = useState(false);
  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang reset data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleReset = async () => {
    handleClose();
    setPost(true);

    await axios
      .post(
        `http://192.168.1.10/action/DeleteAllPerson`,
        {
          operator: "DeleteAllPerson",
          info: {
            DeleteAllPersonCheck: 1,
          },
        },
        {
          auth: {
            username: "admin",
            password: "admin",
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: "Device tidak ditemukan",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      });

    setPost(false);
    Swal.fire({
      title: "Success!",
      text: "Data telah dihapus",
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
        className="btn btn-block me-2 btn-primary light"
      >
        Reset Data
      </button>

      <Modal
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h6 className="font-bold text-lg">Anda jakin reset data ini ?</h6>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-warning light"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-danger light"
            onClick={() => handleReset()}
          >
            Ya, Reset
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Reset;
