type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Tables = {
  contact_submissions: {
    Row: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      company: string | null;
      service: string | null;
      budget: string | null;
      timeline: string | null;
      message: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      email: string;
      company?: string | null;
      service?: string | null;
      budget?: string | null;
      timeline?: string | null;
      message: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      email?: string;
      company?: string | null;
      service?: string | null;
      budget?: string | null;
      timeline?: string | null;
      message?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  newsletter_subscribers: {
    Row: {
      id: string;
      email: string;
      subscribed_at: string;
      unsubscribed_at: string | null;
    };
    Insert: {
      id?: string;
      email: string;
      subscribed_at?: string;
      unsubscribed_at?: string | null;
    };
    Update: {
      id?: string;
      email?: string;
      subscribed_at?: string;
      unsubscribed_at?: string | null;
    };
    Relationships: GenericRelationship[];
  };
  clients: {
    Row: {
      id: string;
      name: string;
      primary_email: string;
      company: string | null;
      status: string;
      billing_model: string;
      default_rate_cents: number | null;
      payment_terms: string | null;
      notes: string | null;
      is_founding: boolean;
      care_start: string | null;
      care_end: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      primary_email: string;
      company?: string | null;
      status?: string;
      billing_model?: string;
      default_rate_cents?: number | null;
      payment_terms?: string | null;
      notes?: string | null;
      is_founding?: boolean;
      care_start?: string | null;
      care_end?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      primary_email?: string;
      company?: string | null;
      status?: string;
      billing_model?: string;
      default_rate_cents?: number | null;
      payment_terms?: string | null;
      notes?: string | null;
      is_founding?: boolean;
      care_start?: string | null;
      care_end?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  invoices: {
    Row: {
      id: string;
      client_id: string;
      number: string;
      title: string;
      amount_cents: number;
      currency: string;
      status: string;
      issued_at: string | null;
      due_at: string | null;
      paid_at: string | null;
      external_url: string | null;
      storage_path: string | null;
      view_token: string | null;
      sent_emailed_at: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      client_id: string;
      number: string;
      title: string;
      amount_cents: number;
      currency?: string;
      status?: string;
      issued_at?: string | null;
      due_at?: string | null;
      paid_at?: string | null;
      external_url?: string | null;
      storage_path?: string | null;
      view_token?: string | null;
      sent_emailed_at?: string | null;
      notes?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      client_id?: string;
      number?: string;
      title?: string;
      amount_cents?: number;
      currency?: string;
      status?: string;
      issued_at?: string | null;
      due_at?: string | null;
      paid_at?: string | null;
      external_url?: string | null;
      storage_path?: string | null;
      view_token?: string | null;
      sent_emailed_at?: string | null;
      notes?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  documents: {
    Row: {
      id: string;
      client_id: string;
      title: string;
      kind: string;
      storage_path: string | null;
      view_token: string | null;
      external_url: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      client_id: string;
      title: string;
      kind?: string;
      storage_path?: string | null;
      view_token?: string | null;
      external_url?: string | null;
      notes?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      client_id?: string;
      title?: string;
      kind?: string;
      storage_path?: string | null;
      view_token?: string | null;
      external_url?: string | null;
      notes?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  client_assets: {
    Row: {
      id: string;
      client_id: string;
      type: string;
      name: string;
      url: string | null;
      monitor_url: string | null;
      env: string;
      managed_by_us: boolean;
      notes: string | null;
      status: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      client_id: string;
      type: string;
      name: string;
      url?: string | null;
      monitor_url?: string | null;
      env?: string;
      managed_by_us?: boolean;
      notes?: string | null;
      status?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      client_id?: string;
      type?: string;
      name?: string;
      url?: string | null;
      monitor_url?: string | null;
      env?: string;
      managed_by_us?: boolean;
      notes?: string | null;
      status?: string;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  client_work_items: {
    Row: {
      id: string;
      client_id: string;
      asset_id: string | null;
      title: string;
      description: string | null;
      status: string;
      priority: string;
      due_at: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      client_id: string;
      asset_id?: string | null;
      title: string;
      description?: string | null;
      status?: string;
      priority?: string;
      due_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      client_id?: string;
      asset_id?: string | null;
      title?: string;
      description?: string | null;
      status?: string;
      priority?: string;
      due_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  admin_loop_events: {
    Row: {
      id: string;
      loop_key: string;
      action: string;
      note: string | null;
      snoozed_until: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      loop_key: string;
      action: string;
      note?: string | null;
      snoozed_until?: string | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      loop_key?: string;
      action?: string;
      note?: string | null;
      snoozed_until?: string | null;
      created_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  ops_checklist_items: {
    Row: {
      checklist_key: string;
      item_key: string;
      checked_at: string;
    };
    Insert: {
      checklist_key: string;
      item_key: string;
      checked_at?: string;
    };
    Update: {
      checklist_key?: string;
      item_key?: string;
      checked_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  lead_candidates: {
    Row: {
      id: string;
      run_id: string;
      place_id: string;
      name: string;
      website: string | null;
      phone: string | null;
      address: string | null;
      city: string;
      vertical: string | null;
      query: string | null;
      score: number;
      reasons: string[];
      email: string | null;
      email_source: string;
      rating: number | null;
      review_count: number | null;
      status: string;
      personalization: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      run_id?: string;
      place_id: string;
      name: string;
      website?: string | null;
      phone?: string | null;
      address?: string | null;
      city?: string;
      vertical?: string | null;
      query?: string | null;
      score?: number;
      reasons?: string[];
      email?: string | null;
      email_source?: string;
      rating?: number | null;
      review_count?: number | null;
      status?: string;
      personalization?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      run_id?: string;
      place_id?: string;
      name?: string;
      website?: string | null;
      phone?: string | null;
      address?: string | null;
      city?: string;
      vertical?: string | null;
      query?: string | null;
      score?: number;
      reasons?: string[];
      email?: string | null;
      email_source?: string;
      rating?: number | null;
      review_count?: number | null;
      status?: string;
      personalization?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  do_not_contact: {
    Row: {
      id: string;
      email_or_domain: string;
      reason: string | null;
      added_at: string;
    };
    Insert: {
      id?: string;
      email_or_domain: string;
      reason?: string | null;
      added_at?: string;
    };
    Update: {
      id?: string;
      email_or_domain?: string;
      reason?: string | null;
      added_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  kb_spaces: {
    Row: {
      id: string;
      title: string;
      slug: string;
      sort_order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      title: string;
      slug: string;
      sort_order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      title?: string;
      slug?: string;
      sort_order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  kb_nodes: {
    Row: {
      id: string;
      space_id: string;
      parent_id: string | null;
      type: string;
      title: string;
      sort_order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      space_id: string;
      parent_id?: string | null;
      type: string;
      title: string;
      sort_order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      space_id?: string;
      parent_id?: string | null;
      type?: string;
      title?: string;
      sort_order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  kb_pages: {
    Row: {
      id: string;
      node_id: string;
      body: string;
      body_text: string | null;
      status: string;
      current_version: number;
      approved_version: number | null;
      requires_ack: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      node_id: string;
      body?: string;
      body_text?: string | null;
      status?: string;
      current_version?: number;
      approved_version?: number | null;
      requires_ack?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      node_id?: string;
      body?: string;
      body_text?: string | null;
      status?: string;
      current_version?: number;
      approved_version?: number | null;
      requires_ack?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  kb_versions: {
    Row: {
      id: string;
      page_id: string;
      version: number;
      body: string;
      status: string;
      author_id: string | null;
      note: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      page_id: string;
      version: number;
      body?: string;
      status: string;
      author_id?: string | null;
      note?: string | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      page_id?: string;
      version?: number;
      body?: string;
      status?: string;
      author_id?: string | null;
      note?: string | null;
      created_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  kb_attachments: {
    Row: {
      id: string;
      page_id: string;
      storage_path: string;
      filename: string;
      mime: string | null;
      kind: string;
      byte_size: number | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      page_id: string;
      storage_path: string;
      filename: string;
      mime?: string | null;
      kind?: string;
      byte_size?: number | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      page_id?: string;
      storage_path?: string;
      filename?: string;
      mime?: string | null;
      kind?: string;
      byte_size?: number | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: GenericRelationship[];
  };
  kb_acknowledgments: {
    Row: {
      id: string;
      page_id: string;
      user_id: string;
      version: number;
      acked_at: string;
    };
    Insert: {
      id?: string;
      page_id: string;
      user_id: string;
      version: number;
      acked_at?: string;
    };
    Update: {
      id?: string;
      page_id?: string;
      user_id?: string;
      version?: number;
      acked_at?: string;
    };
    Relationships: GenericRelationship[];
  };
};

type Views = Record<string, never>;

type Functions = Record<string, never>;

export interface Database {
  public: {
    Tables: Tables;
    Views: Views;
    Functions: Functions;
  };
}
