-- A changed business policy: cancelled rows release their reference.
ALTER TABLE reservations DROP CONSTRAINT reservation_reference;
CREATE UNIQUE INDEX reservation_current_reference
  ON reservations (tenant_id, external_ref)
  WHERE state IN ('draft', 'confirmed');
