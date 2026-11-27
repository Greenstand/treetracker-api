-- Admin NDM integration: audited first allocation of ownerless observations.
ALTER TABLE treetracker.grower_organization_transfer
  ADD COLUMN capture_allocation jsonb;
COMMENT ON COLUMN treetracker.grower_organization_transfer.capture_allocation IS
  'Explicit ownerless allocation: destination project, affected session/capture IDs and prior ownership; actor/reason/time are recorded by this transfer.';
