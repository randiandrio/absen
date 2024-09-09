import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  return NextResponse.json(false);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const data = await request.formData();

  if (params.slug[0] == "post_app") {
    const result = await PostApp(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function PostApp(data: any) {
  const hashPassword = await bcrypt.hash(data.get("password"), 10);

  await prisma.sekolah.create({
    data: {
      nama: String(data.get("namaSekolah")),
      admin: {
        create: [
          {
            nama: String(data.get("namaAdmin")),
            username: String(data.get("username")),
            password: hashPassword,
          },
        ],
      },
    },
  });
  const pesan = {
    error: false,
    message: "Data Sekolah behasil ditambahkan",
  };

  return pesan;
}
