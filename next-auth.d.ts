import NextAuth from "next-auth";

declare module "next-auth" {
  interface AdminLogin {
    id: Number;
    sekolahId: Number;
    nama: String;
    namaSekolah: String;
  }

  interface resData {
    error: boolean;
    message: String;
    data: any;
  }
}
