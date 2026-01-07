-- 1. Enable RLS on the User table (if not already enabled)
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to view their own profile
-- This assumes Supabase Auth is strictly tied to "public"."User" by id or email.
-- Since your Prisma schema uses `id` as UUID, we assume it matches `auth.uid()`.
CREATE POLICY "Users can view own profile"
ON "public"."User"
FOR SELECT
USING (auth.uid() = id);

-- 3. Allow Admins to view ALL profiles
-- This checks if the requesting user has the 'ADMIN' role in the User table.
CREATE POLICY "Admins can view all profiles"
ON "public"."User"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "public"."User"
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- 4. Allow Admins to DELETE users
-- This allows an admin to delete any user record.
CREATE POLICY "Admins can delete any user"
ON "public"."User"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "public"."User"
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- 5. (Optional) Allow Admins to UPDATE users?
-- If admins need to edit users, add an UPDATE policy similar to DELETE.
