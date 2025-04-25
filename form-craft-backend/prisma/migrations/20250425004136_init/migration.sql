-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),
    "role" VARCHAR(10) NOT NULL DEFAULT 'user',
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "shortQ1" TEXT,
    "showShortQ1" BOOLEAN NOT NULL DEFAULT false,
    "shortQ2" TEXT,
    "showShortQ2" BOOLEAN NOT NULL DEFAULT false,
    "shortQ3" TEXT,
    "showShortQ3" BOOLEAN NOT NULL DEFAULT false,
    "shortQ4" TEXT,
    "showShortQ4" BOOLEAN NOT NULL DEFAULT false,
    "desQ1" TEXT,
    "showDesQ1" BOOLEAN NOT NULL DEFAULT false,
    "desQ2" TEXT,
    "showDesQ2" BOOLEAN NOT NULL DEFAULT false,
    "desQ3" TEXT,
    "showDesQ3" BOOLEAN NOT NULL DEFAULT false,
    "desQ4" TEXT,
    "showDesQ4" BOOLEAN NOT NULL DEFAULT false,
    "positiveInt1" INTEGER,
    "showPositiveInt1" BOOLEAN NOT NULL DEFAULT false,
    "positiveInt2" INTEGER,
    "showPositiveInt2" BOOLEAN NOT NULL DEFAULT false,
    "positiveInt3" INTEGER,
    "showPositiveInt3" BOOLEAN NOT NULL DEFAULT false,
    "positiveInt4" INTEGER,
    "showPositiveInt4" BOOLEAN NOT NULL DEFAULT false,
    "checkboxQ1Question" TEXT,
    "checkboxQ1Option1" TEXT,
    "checkboxQ1Option2" TEXT,
    "checkboxQ1Option3" TEXT,
    "checkboxQ1Option4" TEXT,
    "checkboxQ2Question" TEXT,
    "checkboxQ2Option1" TEXT,
    "checkboxQ2Option2" TEXT,
    "checkboxQ2Option3" TEXT,
    "checkboxQ2Option4" TEXT,
    "checkboxQ3Question" TEXT,
    "checkboxQ3Option1" TEXT,
    "checkboxQ3Option2" TEXT,
    "checkboxQ3Option3" TEXT,
    "checkboxQ3Option4" TEXT,
    "checkboxQ4Question" TEXT,
    "checkboxQ4Option1" TEXT,
    "checkboxQ4Option2" TEXT,
    "checkboxQ4Option3" TEXT,
    "checkboxQ4Option4" TEXT,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uid_key" ON "users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");
