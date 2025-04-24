generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int        @id @default(autoincrement())
  uid       String     @unique @db.VarChar(255)
  name      String     @unique @db.VarChar(100)
  email     String     @unique @db.VarChar(100)
  createdAt DateTime   @default(now()) @map("created_at")
  lastLogin DateTime?  @map("last_login")
  role      String     @default("user") @db.VarChar(10)
  isBlocked Boolean    @default(false) @map("is_blocked")
  templates Template[]

  @@map("users")
}

model Template {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  imageUrl    String?  @map("image_url")
  user        User     @relation(fields: [userId], references: [id])
  userId      Int      @map("user_id")
  topic       String
  tags        String[] // e.g. ["news", "tech", "prisma"]

  // === Single-line questions ===
  shortQ1 String?
  shortQ2 String?
  shortQ3 String?
  shortQ4 String?

  // === Multi-line questions ===
  desQ1 String?
  desQ2 String?
  desQ3 String?
  desQ4 String?

  // === Numeric questions ===
  positiveInt1 String?
  positiveInt2 String?
  positiveInt3 String?
  positiveInt4 String?

  // === Checkbox questions ===
  checkboxQ1        String?
  checkboxQ1Options String[]

  checkboxQ2        String?
  checkboxQ2Options String[]

  checkboxQ3        String?
  checkboxQ3Options String[]

  checkboxQ4        String?
  checkboxQ4Options String[]

  @@map("templates")
}
