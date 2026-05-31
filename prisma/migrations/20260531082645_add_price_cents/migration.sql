-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Product_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "ProductCategory" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categorySlug", "createdAt", "featured", "id", "metaDescription", "metaTitle", "published", "slug", "sortOrder", "updatedAt") SELECT "categorySlug", "createdAt", "featured", "id", "metaDescription", "metaTitle", "published", "slug", "sortOrder", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
