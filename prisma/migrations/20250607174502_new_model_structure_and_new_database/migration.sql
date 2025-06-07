/*
  Warnings:

  - You are about to drop the column `capacity` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curso` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxParticipants` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speakerName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `location` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCENT_ASSISTANT', 'COORDINATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Course" AS ENUM ('ADS', 'GE', 'GTI', 'GEMP', 'MEC');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('AUDITORIO', 'BIBLIOTECA', 'SALA_MAKER', 'LAB_MECANICA_METROLOGIA', 'LAB_SISTEMAS_INTEGRADOS', 'LAB_HIDRAULICA_PNEUMATICA', 'LAB_ENSAIOS_METALOGRAFICOS', 'LAB_ELETRONICA_POTENCIA', 'LAB_COMANDOS_ELETRICOS', 'LAB_CONTROLE_PROCESSOS', 'LAB_INFORMATICA_1', 'LAB_INFORMATICA_2', 'LAB_INFORMATICA_3', 'LAB_INFORMATICA_4', 'LAB_INFORMATICA_5', 'LAB_INFORMATICA_6', 'SALA_1', 'SALA_2', 'SALA_3', 'SALA_4', 'SALA_5', 'SALA_6', 'SALA_7', 'SALA_8', 'SALA_9', 'SALA_9_3_4', 'SALA_10', 'SALA_11', 'SALA_12', 'OUTROS');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PALESTRA', 'WORKSHOP', 'OFICINA', 'CURSO', 'VISITA_TECNICA');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "capacity",
DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "name",
DROP COLUMN "ownerId",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentParticipants" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "curso" "Course" NOT NULL,
ADD COLUMN     "customLocation" TEXT,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxParticipants" INTEGER NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "semestre" "Semester",
ADD COLUMN     "speakerName" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "location",
ADD COLUMN     "location" "Location" NOT NULL;
