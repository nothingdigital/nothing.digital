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
      company: string | null;
      service: string | null;
      budget: string | null;
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
