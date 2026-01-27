const DomainEventTypes = {
  CaptureCreated: 'CaptureCreated',
  TreeCreated: 'TreeCreated',
  RawCaptureRejected: 'RawCaptureRejected',
};

const ROLES = {
  super_admin: 'role_super_admin',
  planter_manager: 'role_planter_manager',
  tree_manager: 'role_tree_manager',
};

const POLICIES = {
  SUPER_PERMISSION: 'super_permission',
  MANAGE_GROWER: 'manage_planter',
  LIST_GROWER: 'list_planter',
  LIST_TREE: 'list_tree',
  APPROVE_TREE: 'approve_tree',
  MATCH_CAPTURES: 'match_captures',
  FEATURE_FLAG: 'feature_flag',
};

module.exports = { DomainEventTypes, ROLES, POLICIES };
