export type ConditionLevel = 'brand_new' | 'ninety_pct' | 'seventy_pct' | 'fifty_pct' | 'unusable';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ApplianceCategory {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  hazardous: boolean;
  description: string;
}

export interface Estimation {
  id: string;
  businessNo: string;
  categoryId: string;
  conditionLevel: ConditionLevel | '';
  estimatedPrice: number | null;
  residentName: string;
  phone: string;
  address?: string;
  appointmentDate?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  estimationId: string;
  address: string;
  date: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  active: boolean;
}

export const CONDITION_LABELS: Record<ConditionLevel, string> = {
  brand_new: '全新',
  ninety_pct: '九成新',
  seventy_pct: '七成新',
  fifty_pct: '五成新',
  unusable: '无法使用',
};

export const CONDITION_MULTIPLIERS: Record<ConditionLevel, number> = {
  brand_new: 1.0,
  ninety_pct: 0.75,
  seventy_pct: 0.5,
  fifty_pct: 0.3,
  unusable: 0.1,
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};
