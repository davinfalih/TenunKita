/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `failureReason` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `midtransResponseCode` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `midtransStatusCode` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `midtransToken` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProof` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payment` table. All the data in the column will be lost.
  - You are about to alter the column `paymentMethod` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - The values [FAILED,EXPIRED,CANCELLED] on the enum `Payment_paymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('PENDING', 'WAITING_VERIFICATION', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `expiresAt`,
    DROP COLUMN `failureReason`,
    DROP COLUMN `midtransResponseCode`,
    DROP COLUMN `midtransStatusCode`,
    DROP COLUMN `midtransToken`,
    DROP COLUMN `paymentProof`,
    DROP COLUMN `transactionId`,
    MODIFY `paymentMethod` ENUM('BANK_TRANSFER', 'E_WALLET', 'CASH') NOT NULL DEFAULT 'BANK_TRANSFER',
    MODIFY `paymentStatus` ENUM('PENDING', 'PAID', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `PaymentProof` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `adminNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PaymentProof_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentProof` ADD CONSTRAINT `PaymentProof_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
