-- Add new timer_ends_at column
ALTER TABLE "document" ADD COLUMN "timer_ends_at" timestamp with time zone;

-- Migrate existing timer_duration values to timer_ends_at
-- If timer_duration is not null, set timer_ends_at to now + timer_duration minutes
-- If timer_duration is null, leave timer_ends_at as null (unlimited)
UPDATE "document" 
SET "timer_ends_at" = CURRENT_TIMESTAMP + make_interval(mins => timer_duration)
WHERE "timer_duration" IS NOT NULL;

-- Drop the old timer_duration column
ALTER TABLE "document" DROP COLUMN "timer_duration";

