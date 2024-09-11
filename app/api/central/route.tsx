import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  const result = await Post(body);

  console.log(result);
  return NextResponse.json(true, { status: 200 });
};

async function Post(data: any) {
  const user = await prisma.user.findMany({
    where: { id: data.CustomizeID },
  });

  if (user.length < 1) return false;

  const tanggal = moment().format("YYYY-MM-DD");
  const pukul = moment().format("HH:mm");
  console.log(tanggal);

  const response = await prisma.presensi.create({
    data: {
      sekolahId: Number(user[0].sekolahId),
      tanggal: tanggal,
      pukul: pukul,
      status: "Hadir",
      userId: Number(user[0].id),
    },
  });

  return response;
}
