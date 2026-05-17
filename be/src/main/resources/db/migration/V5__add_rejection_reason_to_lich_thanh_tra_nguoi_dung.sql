-- Add column to store rejection reason from users when they decline an assignment
ALTER TABLE lich_thanh_tra_nguoi_dung ADD COLUMN lyDoTuChoi text;

-- existing rows will have NULL in this new column
-- If you want to backfill data, add UPDATE statements here.
