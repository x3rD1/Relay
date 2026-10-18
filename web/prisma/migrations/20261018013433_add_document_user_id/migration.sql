/*
  Warnings:

  - Added the required column `userId` to the `knowledgeDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "knowledgeDocuments" ADD COLUMN     "userId" TEXT NOT NULL;
