-- ============================================
-- Smart Bookmark App — Database Migration
-- ============================================

-- 1. Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- SELECT: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only insert bookmarks for themselves
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Enable Realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
