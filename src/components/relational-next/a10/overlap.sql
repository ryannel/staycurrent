CREATE EXTENSION btree_gist;
ALTER TABLE reservations ADD CONSTRAINT reservation_no_overlap
  EXCLUDE USING gist (
    tenant_id WITH =,
    resource_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (state = 'confirmed');
