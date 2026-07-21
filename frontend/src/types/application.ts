export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'ASSESSMENT' | 'INTERVIEW' | 'REJECTED' | 'OFFER';

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string | null;
  source?: string | null;
  status: ApplicationStatus | string;
  applicationDate: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  total: number;
  saved: number;
  applied: number;
  assessment: number;
  interview: number;
  rejected: number;
  offer: number;
}
