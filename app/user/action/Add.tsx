"use client";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { tampilLoading } from "@/app/helper";
import { Kelas } from "@prisma/client";

import "cropperjs/dist/cropper.css";
import { Cropper } from "react-cropper";

function Add({ reload, listKelas }: { reload: Function; listKelas: Kelas[] }) {
  const [kelasId, setKelasId] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [picInfo, setPicInfo] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const cropperRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const getCropData = () => {
    // @ts-ignore
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      setPicInfo(cropper.getCroppedCanvas().toDataURL());
      console.log(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (picInfo == "") {
      Swal.fire({
        title: "Ups",
        text: "Silahkan klik crop image",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    setPost(true);
    const formData = new FormData();
    formData.append("method", "add");
    formData.append("kelasId", String(kelasId));
    formData.append("nama", String(nama));
    formData.append("jenisKelamin", String(jenisKelamin));
    formData.append("tempatLahir", String(tempatLahir));
    formData.append("tanggalLahir", String(tanggalLahir));
    formData.append("alamat", String(alamat));
    formData.append("picInfo", String(picInfo));
    const x = await axios.patch("/user/api/post", formData);
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

  function clearForm() {
    setKelasId("");
    setNama("");
    setJenisKelamin("");
    setTempatLahir("");
    setTanggalLahir("");
    setAlamat("");
    setImage(null);
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah User
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
            <Modal.Title>Tambahkan User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {image && (
              <Cropper
                src={image}
                style={{ height: 400, width: "100%" }}
                // Set konfigurasi Cropper.js
                initialAspectRatio={1}
                guides={false}
                cropBoxResizable={true}
                ref={cropperRef}
                viewMode={1}
                dragMode="move"
                autoCropArea={1}
              />
            )}

            {image && (
              <button
                onClick={getCropData}
                type="button"
                className="btn btn-block btn-primary light"
              >
                Crop Image
              </button>
            )}

            <div className="mb-3 mt-3 row">
              <label className="col-sm-4 col-form-label">Foto</label>
              <div className="col-sm-8">
                <input
                  required
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={onSelectFile}
                />
              </div>
            </div>

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
                  className="form-control"
                  value={kelasId}
                  onChange={(e) => {
                    setKelasId(e.target.value);
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

export default Add;
