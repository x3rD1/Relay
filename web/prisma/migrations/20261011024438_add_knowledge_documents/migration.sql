-- CreateTable
CREATE TABLE "knowledgeDocuments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledgeDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledgeSections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "knowledgeDocumentId" TEXT NOT NULL,

    CONSTRAINT "knowledgeSections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "knowledgeSections" ADD CONSTRAINT "knowledgeSections_knowledgeDocumentId_fkey" FOREIGN KEY ("knowledgeDocumentId") REFERENCES "knowledgeDocuments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
