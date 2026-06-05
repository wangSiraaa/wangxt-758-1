import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApplianceCategory, ServiceArea, Estimation, Appointment } from '@/types';
import { DEFAULT_CATEGORIES, DEFAULT_SERVICE_AREAS, SAMPLE_ESTIMATIONS, SAMPLE_APPOINTMENTS } from '@/utils/sampleData';

interface StoreState {
  categories: ApplianceCategory[];
  serviceAreas: ServiceArea[];
  estimations: Estimation[];
  appointments: Appointment[];

  addCategory: (cat: ApplianceCategory) => void;
  updateCategory: (cat: ApplianceCategory) => void;
  deleteCategory: (id: string) => void;

  addServiceArea: (area: ServiceArea) => void;
  updateServiceArea: (area: ServiceArea) => void;
  deleteServiceArea: (id: string) => void;

  addEstimation: (est: Estimation) => void;

  addAppointment: (apt: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  hasDuplicateAppointment: (address: string, date: string) => boolean;

  loadSampleData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      serviceAreas: DEFAULT_SERVICE_AREAS,
      estimations: [],
      appointments: [],

      addCategory: (cat) => set((s) => ({ categories: [...s.categories, cat] })),
      updateCategory: (cat) => set((s) => ({
        categories: s.categories.map((c) => (c.id === cat.id ? cat : c)),
      })),
      deleteCategory: (id) => set((s) => ({
        categories: s.categories.filter((c) => c.id !== id),
      })),

      addServiceArea: (area) => set((s) => ({ serviceAreas: [...s.serviceAreas, area] })),
      updateServiceArea: (area) => set((s) => ({
        serviceAreas: s.serviceAreas.map((a) => (a.id === area.id ? area : a)),
      })),
      deleteServiceArea: (id) => set((s) => ({
        serviceAreas: s.serviceAreas.filter((a) => a.id !== id),
      })),

      addEstimation: (est) => set((s) => ({ estimations: [...s.estimations, est] })),

      addAppointment: (apt) => set((s) => ({ appointments: [...s.appointments, apt] })),
      updateAppointmentStatus: (id, status) => set((s) => ({
        appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
      })),

      hasDuplicateAppointment: (address, date) => {
        const normalized = address.trim().toLowerCase();
        return get().appointments.some(
          (a) =>
            a.address.trim().toLowerCase() === normalized &&
            a.date === date &&
            a.status !== 'cancelled',
        );
      },

      loadSampleData: () =>
        set({
          estimations: SAMPLE_ESTIMATIONS,
          appointments: SAMPLE_APPOINTMENTS,
        }),
    }),
    { name: 'recycle-estimation-store' },
  ),
);
