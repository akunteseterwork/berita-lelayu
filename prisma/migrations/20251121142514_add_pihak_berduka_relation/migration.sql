/*
  Warnings:

  - You are about to drop the `berita-lelayu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "berita-lelayu";

-- CreateTable
CREATE TABLE "berita_lelayu" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "berita_lelayu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pihak_berduka" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hubungan" TEXT,
    "beritaLelayuId" TEXT NOT NULL,

    CONSTRAINT "pihak_berduka_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pihak_berduka" ADD CONSTRAINT "pihak_berduka_beritaLelayuId_fkey" FOREIGN KEY ("beritaLelayuId") REFERENCES "berita_lelayu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
