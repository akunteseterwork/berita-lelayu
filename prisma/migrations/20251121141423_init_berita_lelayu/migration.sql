-- CreateTable
CREATE TABLE "berita-lelayu" (
    "id" TEXT NOT NULL,
    "namaAlmarhum" TEXT NOT NULL,
    "usia" INTEGER NOT NULL,
    "padukuhan" TEXT NOT NULL,
    "hariMeninggal" TEXT NOT NULL,
    "tanggalMeninggal" TEXT NOT NULL,
    "jamMeninggal" TEXT NOT NULL,
    "hariPemakaman" TEXT NOT NULL,
    "tanggalPemakaman" TEXT NOT NULL,
    "jamPemakaman" TEXT NOT NULL,
    "makamLengkap" TEXT NOT NULL,
    "yangBerduka" TEXT NOT NULL,
    "hubungan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "berita-lelayu_pkey" PRIMARY KEY ("id")
);
