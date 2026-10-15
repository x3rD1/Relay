CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "knowledgeSections" ADD COLUMN     "embedding" vector(768);
