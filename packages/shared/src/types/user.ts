export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  locale: 'fr' | 'en';
  plan: UserPlan;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPlan = 'FREE' | 'TRIPI_PLUS' | 'TRIPI_PRO';