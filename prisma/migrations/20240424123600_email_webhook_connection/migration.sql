-- CreateTable
CREATE TABLE "WebhookConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "craftId" TEXT NOT NULL,

    CONSTRAINT "WebhookConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "craftId" TEXT NOT NULL,

    CONSTRAINT "EmailConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookConnection" ADD CONSTRAINT "WebhookConnection_craftId_fkey" FOREIGN KEY ("craftId") REFERENCES "Craft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailConnection" ADD CONSTRAINT "EmailConnection_craftId_fkey" FOREIGN KEY ("craftId") REFERENCES "Craft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
