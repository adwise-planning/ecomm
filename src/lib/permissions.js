export const PERMISSIONS = {
  // L1 - Super Admin
  L1: {
    global: {
      can_view_global_dashboard: true,
      can_impersonate_users: true,
    },
    billing: {
      can_view_all_billing: true,
      can_edit_pricing: true,
    },
    users: {
      can_manage_all_users: true,
    },
    settings: {
      can_manage_feature_toggles: true,
      can_manage_sync_configs: true,
    },
    analytics: {
      can_view_all_analytics: true,
    },
  },

  // L2 - Company Manager
  L2: {
    dashboard: {
      can_view_assigned_dashboards: true,
      can_customize_widgets: true,
    },
    billing: {
      can_view_pricing: 'readonly',
    },
    analytics: {
      can_view_aggregate_analytics: true,
    },
  },

  // L3 - Client Account
  L3: {
    dashboard: {
      can_view_company_dashboard: true,
    },
    data: {
      can_upload_data: true,
      can_manage_api_connections: true,
      can_trigger_manual_sync: true,
    },
    users: {
      can_manage_l4_users: true,
    },
    billing: {
      can_view_own_billing: true,
      can_download_invoices: true,
    },
    analytics: {
      can_view_company_analytics: true,
    }
  },

  // L4 - Read-Only User
  L4: {
    dashboard: {
      can_view_shared_dashboards: true,
    },
  },
};

export const hasPermission = (role, permission) => {
  if (!role || !permission) {
    return false;
  }

  const [category, action] = permission.split('.');
  if (!category || !action) {
    return false;
  }

  return PERMISSIONS[role]?.[category]?.[action] === true;
};
