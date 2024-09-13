/*
  Warnings:

  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "updateAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
