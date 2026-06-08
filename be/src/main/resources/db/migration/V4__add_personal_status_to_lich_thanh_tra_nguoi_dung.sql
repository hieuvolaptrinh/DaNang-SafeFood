-- =====================================================================
-- V4: Add personal status and notes to LichThanhTra_NguoiDung table
-- =====================================================================
-- Rationale: When multiple people are assigned to the same LichThanhTra,
-- each person needs their own progress status and notes, independent of others.
-- This prevents one person's update from affecting others' views.

ALTER TABLE "LichThanhTra_NguoiDung"
ADD COLUMN IF NOT EXISTS "trangThai" varchar(30) DEFAULT 'Chưa nhận',
ADD COLUMN IF NOT EXISTS "ghiChu" text;

-- Set default status for existing records (in case any exist)
UPDATE "LichThanhTra_NguoiDung"
SET "trangThai" = 'Chưa nhận'
WHERE "trangThai" IS NULL;
