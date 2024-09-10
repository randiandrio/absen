"use client";
import { useState, SyntheticEvent, useRef, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { tampilLoading } from "@/app/helper";
import { resData } from "next-auth";

function Add({ reload }: { reload: Function }) {
  const [deviceID, setDeviceID] = useState("");
  const [deviceIP, setDeviceIP] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function clearForm() {
    setDeviceID("");
    setDeviceIP("");
  }

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (deviceID == "") {
      Swal.fire({
        title: "Error",
        text: "Device tidak ditemukan",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    setPost(true);
    const formData = new FormData();
    formData.append("deviceID", String(deviceID));
    formData.append("deviceIP", String(deviceIP));
    const x = await axios.patch("/device/api/post", formData);
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

  const handleScan = async () => {
    fetch(`http://${deviceIP}/action/GetSysParam`)
      .then((response) => response.json())
      .then((data) => console.log(data));

    // await axios
    //   .post(
    //     `http://${deviceIP}/action/GetSysParam`,
    //     {},
    //     {
    //       timeout: 1000,
    //       auth: {
    //         username: "admin",
    //         password: "admin",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setDeviceID(response.data.info.DeviceID);
    //   })
    //   .catch((error) => {
    //     Swal.fire({
    //       title: "Error",
    //       text: "Device tidak ditemukan",
    //       icon: "error",
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //   });
  };

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light mb-2"
      >
        Tambah Device
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
            <Modal.Title>Tambah Device</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Device IP</label>
              <div className="col-sm-9">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={deviceIP}
                  onChange={(e) => setDeviceIP(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Device ID</label>
              <div className="col-sm-6">
                <input
                  required
                  disabled
                  type="text"
                  className="form-control"
                  value={deviceID}
                  onChange={(e) => setDeviceID(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <button
                  type="button"
                  className="btn btn-block  btn-info light"
                  onClick={handleScan}
                >
                  Scan
                </button>
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
