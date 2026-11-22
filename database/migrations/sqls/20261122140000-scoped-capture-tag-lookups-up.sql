-- Admin Panel NDM integration: support organization dictionaries and project usage lookups.
-- Ownership already exists in tag.owner_id; no ownership is guessed or rewritten here.
CREATE INDEX tag_owner_active_name_idx ON treetracker.tag(owner_id,lower(name)) WHERE status='active';
CREATE INDEX capture_tag_active_tag_capture_idx ON treetracker.capture_tag(tag_id,capture_id) WHERE status='active';
