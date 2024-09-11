import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  console.log(body.CustomizeID);
  return NextResponse.json(true, { status: 200 });
};

async function Post(data: any) {
  const user = await prisma.user.findUnique({
    where: { id: data.CustomizeID },
  });
  await prisma.presensi.create({
    data: {
      sekolahId: Number(user?.sekolahId),
      tanggal: moment().format("YYYY-MM-DD"),
      status: "Hadir",
      userId: Number(user?.id),
    },
  });

  return true;
}
