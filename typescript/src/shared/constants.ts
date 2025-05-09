export const anonymousAllowedTools = [
  'list_products',
  'search_products',
  'read_category',
];
export const customerAllowedTools = [
  ...anonymousAllowedTools,
  'read_order',
  'read_cart',
  'create_cart',
  'update_cart',
  'replicate_cart',
];
