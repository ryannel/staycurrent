-- An isolated extension: explicit IDs keep the circular example small.
CREATE TABLE lead_reservations (
  tenant_id integer NOT NULL,
  reservation_id integer NOT NULL,
  lead_participant_id integer NOT NULL,
  PRIMARY KEY (tenant_id, reservation_id)
);
CREATE TABLE participants (
  tenant_id integer NOT NULL,
  reservation_id integer NOT NULL,
  participant_id integer NOT NULL,
  PRIMARY KEY (tenant_id, reservation_id, participant_id),
  FOREIGN KEY (tenant_id, reservation_id)
    REFERENCES lead_reservations (tenant_id, reservation_id)
);
ALTER TABLE lead_reservations ADD CONSTRAINT reservation_lead
  FOREIGN KEY (tenant_id, reservation_id, lead_participant_id)
  REFERENCES participants (tenant_id, reservation_id, participant_id)
  DEFERRABLE INITIALLY DEFERRED;
