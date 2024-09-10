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
  const result = await prisma.device.findMany({
    where: {
      sekolahId: Number(admin.sekolahId),
    },
  });
  return result;
}

async function Post(data: any, admin: AdminLogin) {
  await prisma.device.upsert({
    where: {
      deviceId_sekolahId: {
        sekolahId: Number(admin.sekolahId),
        deviceID: Number(data.get("deviceID")),
      },
    },
    update: {
      deviceIP: String(data.get("deviceIP")),
    },
    create: {
      sekolahId: Number(admin.sekolahId),
      deviceID: Number(data.get("deviceID")),
      deviceIP: String(data.get("deviceIP")),
    },
  });

  return { error: false, message: "Post Device Sukses" };
}

async function Delete(data: any) {
  const result = await prisma.device.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
