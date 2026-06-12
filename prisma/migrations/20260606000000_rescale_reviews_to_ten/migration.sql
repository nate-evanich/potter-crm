-- Double all existing review ratings from the 1-5 scale to the 1-10 scale.
-- The WHERE guard makes this idempotent: rows already on the 1-10 scale
-- (rating > 5) are left untouched.
UPDATE "Review" SET "rating" = "rating" * 2 WHERE "rating" <= 5;
