import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pihakBerduka, ...lelayuData } = body;
    const usiaInt = Number(lelayuData.usia) || 0;

    if (!lelayuData.namaAlmarhum || !lelayuData.padukuhan) {
      return NextResponse.json({ error: 'Nama Almarhum dan Padukuhan harus diisi.' }, { status: 400 });
    }
    const pihakBerdukaCreate = pihakBerduka.map((p: any) => ({
        nama: p.nama,
        hubungan: p.hubungan || null,
    }));
    
    const newEntry = await prisma.beritaLelayu.create({
      data: {
        ...lelayuData,
        usia: usiaInt, 
        
        pihakBerduka: {
            create: pihakBerdukaCreate,
        }
      },
    });

    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    console.error("Error creating lelayu entry:", error);
    return NextResponse.json({ error: 'Gagal menyimpan data ke database. Cek log server.' }, { status: 500 });
  }
}