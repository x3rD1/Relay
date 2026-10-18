/*
  Warnings:

  - You are about to drop the `workflowSteps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "workflowSteps" DROP CONSTRAINT "workflowSteps_workflowId_fkey";

-- DropTable
DROP TABLE "workflowSteps";

-- DropTable
DROP TABLE "workflows";
