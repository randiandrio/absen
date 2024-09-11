"use client";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { tampilLoading } from "@/app/helper";
import { Kelas, User } from "@prisma/client";

import "cropperjs/dist/cropper.css";
import { Cropper } from "react-cropper";

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

    if (picInfo == "" && image != null) {
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
    formData.append("method", "edit");
    formData.append("id", String(user.id));
    formData.append("kelasId", String(kelasId));
    formData.append("nama", String(nama));
    formData.append("jenisKelamin", String(jenisKelamin));
    formData.append("tempatLahir", String(tempatLahir));
    formData.append("tanggalLahir", String(tanggalLahir));
    formData.append("alamat", String(alamat));
    if (picInfo != "") {
      formData.append("picInfo", String(picInfo));
    }
    const x = await axios.patch("/user/api/post", formData);
    const pesan = (await x.data) as resData;
    reload();
    setImage(null);
    setPicInfo("");
    handleClose();
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
            <Modal.Title>Edit User</Modal.Title>
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
