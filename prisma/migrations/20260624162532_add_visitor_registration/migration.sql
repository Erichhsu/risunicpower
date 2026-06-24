-- CreateTable
CREATE TABLE "VisitorRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "refId" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "hostTitle" TEXT,
    "visitorName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "visitorTitle" TEXT,
    "contact" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "visitDate" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorRegistration_refId_key" ON "VisitorRegistration"("refId");

-- CreateIndex
CREATE INDEX "VisitorRegistration_createdAt_idx" ON "VisitorRegistration"("createdAt");
