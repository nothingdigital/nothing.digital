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
  portfolio_items: {
    Row: {
      id: string;
      slug: string;
      title: string;
      client: string;
      industry: string | null;
      services: string[];
      summary: string;
      challenge: string | null;
      solution: string | null;
      results: string | null;
      tech_stack: string[];
      testimonial: string | null;
      featured: boolean;
      published: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      slug: string;
      title: string;
      client: string;
      industry?: string | null;
      services?: string[];
      summary: string;
      challenge?: string | null;
      solution?: string | null;
      results?: string | null;
      tech_stack?: string[];
      testimonial?: string | null;
      featured?: boolean;
      published?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      slug?: string;
      title?: string;
      client?: string;
      industry?: string | null;
      services?: string[];
      summary?: string;
      challenge?: string | null;
      solution?: string | null;
      results?: string | null;
      tech_stack?: string[];
      testimonial?: string | null;
      featured?: boolean;
      published?: boolean;
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
