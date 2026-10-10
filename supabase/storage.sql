-- ============================================================================
-- Storage buckets + policies
--
-- Run this AFTER schema.sql, also in the SQL Editor.
-- Creates the two storage buckets used by the admin media manager, and lets
-- anyone READ their files (so your public site can display images) while
-- only authenticated (admin) users can upload/replace/delete.
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('portfolio-images', 'portfolio-images', true),
  ('portfolio-videos', 'portfolio-videos', true)
on conflict (id) do nothing;

-- Public read access to both buckets
create policy "Public read portfolio-images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Public read portfolio-videos"
  on storage.objects for select
  using (bucket_id = 'portfolio-videos');

-- Authenticated (admin) users can upload / replace / delete in both buckets
create policy "Authenticated upload portfolio-images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Authenticated update portfolio-images"
  on storage.objects for update
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Authenticated delete portfolio-images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Authenticated upload portfolio-videos"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-videos' and auth.role() = 'authenticated');

create policy "Authenticated update portfolio-videos"
  on storage.objects for update
  using (bucket_id = 'portfolio-videos' and auth.role() = 'authenticated');

create policy "Authenticated delete portfolio-videos"
  on storage.objects for delete
  using (bucket_id = 'portfolio-videos' and auth.role() = 'authenticated');
