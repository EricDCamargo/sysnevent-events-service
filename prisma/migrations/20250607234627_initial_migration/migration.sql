-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "events";

-- CreateEnum
CREATE TYPE "events"."Course" AS ENUM ('ADS', 'GE', 'GTI', 'GEMP', 'MEC');

-- CreateEnum
CREATE TYPE "events"."Semester" AS ENUM ('SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6');

-- CreateEnum
CREATE TYPE "events"."Location" AS ENUM ('AUDITORIO', 'BIBLIOTECA', 'SALA_MAKER', 'LAB_MECANICA_METROLOGIA', 'LAB_SISTEMAS_INTEGRADOS', 'LAB_HIDRAULICA_PNEUMATICA', 'LAB_ENSAIOS_METALOGRAFICOS', 'LAB_ELETRONICA_POTENCIA', 'LAB_COMANDOS_ELETRICOS', 'LAB_CONTROLE_PROCESSOS', 'LAB_INFORMATICA_1', 'LAB_INFORMATICA_2', 'LAB_INFORMATICA_3', 'LAB_INFORMATICA_4', 'LAB_INFORMATICA_5', 'LAB_INFORMATICA_6', 'SALA_1', 'SALA_2', 'SALA_3', 'SALA_4', 'SALA_5', 'SALA_6', 'SALA_7', 'SALA_8', 'SALA_9', 'SALA_9_3_4', 'SALA_10', 'SALA_11', 'SALA_12', 'OUTROS');

-- CreateEnum
CREATE TYPE "events"."Category" AS ENUM ('PALESTRA', 'WORKSHOP', 'OFICINA', 'CURSO', 'VISITA_TECNICA');

-- CreateTable
CREATE TABLE "events"."Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "events"."Category" NOT NULL,
    "course" "events"."Course" NOT NULL,
    "semester" "events"."Semester",
    "maxParticipants" INTEGER NOT NULL,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "location" "events"."Location" NOT NULL,
    "customLocation" TEXT,
    "speakerName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
