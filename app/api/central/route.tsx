import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();

  return NextResponse.json(body, { status: 200 });
};

async function Post(data: any) {
  //   const user = await prisma.user.findUnique({
  //     where: { id: data.CustomizeID },
  //   });
  //   const response = await prisma.presensi.create({
  //     data: {
  //       sekolahId: Number(user?.sekolahId),
  //       tanggal: moment().format("YYYY-MM-DD"),
  //       status: "Hadir",
  //       userId: Number(user?.id),
  //     },
  //   });

  return data;
}
