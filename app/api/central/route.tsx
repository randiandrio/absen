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
  const user = await prisma.user.findUnique({
    where: { id: data.CustomizeID },
  });

  const x = moment().add(7, "hour");
  const tanggal = moment(x).format("YYYY-MM-DD");
  const pukul = moment(x).format("HH:mm");

  const response = await prisma.presensi.create({
    data: {
      sekolahId: Number(user?.sekolahId),
      tanggal: tanggal,
      pukul: pukul,
      status: "Hadir",
      userId: Number(user?.id),
    },
  });

  return response;
}
