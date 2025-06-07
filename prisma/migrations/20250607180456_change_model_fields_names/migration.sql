/*
  Warnings:

  - You are about to drop the column `curso` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `semestre` on the `Event` table. All the data in the column will be lost.
  - Added the required column `course` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "curso",
DROP COLUMN "nome",
DROP COLUMN "semestre",
ADD COLUMN     "course" "Course" NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "semester" "Semester";
