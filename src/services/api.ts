import { Lead, LeadStatus, UserProfile, FollowUpLog } from '../types';

const API_BASE = '/api';

export const leadService = {
  async getLeads(filters?: {
    search?: string;
    status?: string;
    product?: string;
    city?: string;
    source?: string;
    period?: string;
    sortBy?: string;
  }): Promise<Lead[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.product && filters.product !== 'all') params.append('product', filters.product);
    if (filters?.city && filters.city !== 'all') params.append('city', filters.city);
    if (filters?.source && filters.source !== 'all') params.append('source', filters.source);
    if (filters?.period && filters.period !== 'all') params.append('period', filters.period);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const res = await fetch(`${API_BASE}/leads?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengambil daftar lead');
    return json.data;
  },

  async getLeadById(id: string): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengambil detail lead');
    return json.data;
  },

  async createLead(leadData: {
    name: string;
    phone: string;
    city: string;
    source: string;
    productId: string;
    status?: LeadStatus;
    initialNotes?: string;
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
  }): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal menambahkan lead');
    return json.data;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui lead');
    return json.data;
  },

  async deleteLead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal menghapus lead');
  },
};

export const followUpService = {
  async saveFollowUp(
    leadId: string,
    logData: Omit<FollowUpLog, 'id' | 'createdAt'>
  ): Promise<{ log: FollowUpLog; lead: Lead }> {
    const res = await fetch(`${API_BASE}/leads/${leadId}/follow-ups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mencatat follow up');
    return json.data;
  },

  async getSummary(): Promise<{
    total: number;
    overdue: Lead[];
    today: Lead[];
    upcoming: Lead[];
  }> {
    const res = await fetch(`${API_BASE}/follow-ups/summary`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengambil ringkasan follow up');
    return json.data;
  },
};

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengambil profil');
    return json.data;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui profil');
    return json.data;
  },

  async resetData(): Promise<void> {
    const res = await fetch(`${API_BASE}/profile/reset`, {
      method: 'POST',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal melakukan reset data');
  },
};

export const reportService = {
  async getDashboardData(): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/dashboard`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengambil data dashboard');
    return json.data;
  },

  async getPerformanceData(): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/performance`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengambil data performa');
    return json.data;
  },
};
