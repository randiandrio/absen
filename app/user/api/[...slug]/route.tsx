import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { AdminLogin } from "next-auth";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as AdminLogin;

  if (params.slug[0] === "get") {
    const result = await Get(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "kelas") {
    const result = await Kelas(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "data_user") {
    const result = await DataUser(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as AdminLogin;

  const data = await request.formData();

  if (params.slug[0] == "post") {
    const result = await Post(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "delete") {
    const result = await Delete(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Get(admin: AdminLogin, kelas: any) {
  const result = await prisma.user.findMany({
    where: {
      sekolahId: Number(admin.sekolahId),
      kelasId: kelas == "All" ? undefined : Number(kelas),
    },
    include: {
      kelas: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
  return result;
}

async function DataUser(admin: AdminLogin) {
  const result = await prisma.user.findMany({
    where: {
      sekolahId: Number(admin.sekolahId),
    },
  });
  return result;
}

async function Kelas(admin: AdminLogin) {
  const result = await prisma.kelas.findMany({
    where: {
      sekolahId: Number(admin.sekolahId),
    },
    orderBy: {
      nama: "asc",
    },
  });
  return result;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("method")) == "add") {
    await prisma.user.create({
      data: {
        sekolahId: Number(admin.sekolahId),
        kelasId: Number(data.get("kelasId")),
        nama: String(data.get("nama")),
        jenisKelamin: String(data.get("jenisKelamin")),
        tempatLahir: String(data.get("tempatLahir")),
        tanggalLahir: String(data.get("tanggalLahir")),
        alamat: String(data.get("alamat")),
        picInfo: String(data.get("picInfo")),
      },
    });
  } else {
    await prisma.user.update({
      where: { id: Number(data.get("id")) },
      data: {
        kelasId: Number(data.get("kelasId")),
        nama: String(data.get("nama")),
        jenisKelamin: String(data.get("jenisKelamin")),
        tempatLahir: String(data.get("tempatLahir")),
        tanggalLahir: String(data.get("tanggalLahir")),
        alamat: String(data.get("alamat")),
      },
    });
    if (data.get("picInfo")) {
      await prisma.user.update({
        where: { id: Number(data.get("id")) },
        data: {
          picInfo: String(data.get("picInfo")),
        },
      });
    }
  }
  return { err: false, msg: "Post user Sukses" };
}

async function Delete(data: any) {
  const result = await prisma.user.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
