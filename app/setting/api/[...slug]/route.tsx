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
    const result = await Get(adminLogin);
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

async function Get(admin: AdminLogin) {
  const result = await prisma.setting.findMany({
    where: {
      sekolahId: Number(admin.sekolahId),
    },
  });
  return result;
}

async function Post(data: any, admin: AdminLogin) {
  await prisma.setting.upsert({
    where: {
      hari_sekolahId: {
        hari: String(data.get("hari")),
        sekolahId: Number(admin.sekolahId),
      },
    },
    update: {
      hari: String(data.get("hari")),
      awal: String(data.get("awal")),
      akhir: String(data.get("akhir")),
      terlambat: Number(data.get("terlambat")),
      pulang: String(data.get("pulang")),
    },
    create: {
      sekolahId: Number(admin.sekolahId),
      hari: String(data.get("hari")),
      awal: String(data.get("awal")),
      akhir: String(data.get("akhir")),
      terlambat: Number(data.get("terlambat")),
      pulang: String(data.get("pulang")),
    },
  });

  return { err: false, msg: "Post Kelas Sukses" };
}

async function Delete(data: any) {
  const result = await prisma.setting.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
