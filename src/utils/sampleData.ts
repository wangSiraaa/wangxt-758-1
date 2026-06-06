import type { ApplianceCategory, ServiceArea, Estimation, Appointment } from '@/types';

export const DEFAULT_CATEGORIES: ApplianceCategory[] = [
  { id: 'cat-1', name: '电视机', icon: 'Tv', basePrice: 200, hazardous: false, description: '各类液晶、CRT电视' },
  { id: 'cat-2', name: '冰箱', icon: 'Refrigerator', basePrice: 300, hazardous: true, description: '含制冷剂，需专业拆解' },
  { id: 'cat-3', name: '洗衣机', icon: 'WashingMachine', basePrice: 180, hazardous: false, description: '滚筒/波轮洗衣机' },
  { id: 'cat-4', name: '空调', icon: 'AirVent', basePrice: 350, hazardous: true, description: '含氟利昂，需专业回收' },
  { id: 'cat-5', name: '电脑', icon: 'Monitor', basePrice: 150, hazardous: false, description: '台式机/笔记本' },
  { id: 'cat-6', name: '微波炉', icon: 'Microwave', basePrice: 80, hazardous: false, description: '家用微波炉' },
  { id: 'cat-7', name: '热水器', icon: 'Flame', basePrice: 120, hazardous: true, description: '含燃气/电热组件，需专业拆解' },
  { id: 'cat-8', name: '电风扇', icon: 'Fan', basePrice: 30, hazardous: false, description: '台扇/落地扇' },
];

export const DEFAULT_SERVICE_AREAS: ServiceArea[] = [
  { id: 'area-1', name: '朝阳区', active: true },
  { id: 'area-2', name: '海淀区', active: true },
  { id: 'area-3', name: '丰台区', active: true },
  { id: 'area-4', name: '西城区', active: false },
  { id: 'area-5', name: '东城区', active: true },
];

export const SAMPLE_ESTIMATIONS: Estimation[] = [
  {
    id: 'est-1',
    businessNo: 'BIZ202606040001',
    categoryId: 'cat-1',
    conditionLevel: 'seventy_pct',
    estimatedPrice: 100,
    residentName: '张三',
    phone: '13800138001',
    address: '朝阳区建国路88号',
    appointmentDate: '2026-06-06',
    createdAt: '2026-06-04T10:30:00Z',
  },
  {
    id: 'est-2',
    businessNo: 'BIZ202606040002',
    categoryId: 'cat-3',
    conditionLevel: 'ninety_pct',
    estimatedPrice: 135,
    residentName: '李四',
    phone: '13800138002',
    address: '海淀区中关村大街1号',
    appointmentDate: '2026-06-07',
    createdAt: '2026-06-04T14:20:00Z',
  },
  {
    id: 'est-3',
    businessNo: 'BIZ202606050001',
    categoryId: 'cat-5',
    conditionLevel: 'fifty_pct',
    estimatedPrice: 45,
    residentName: '王五',
    phone: '13800138003',
    createdAt: '2026-06-05T09:00:00Z',
  },
];

export const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    estimationId: 'est-1',
    address: '朝阳区建国路88号',
    date: '2026-06-06',
    status: 'pending',
    createdAt: '2026-06-04T10:35:00Z',
  },
  {
    id: 'apt-2',
    estimationId: 'est-2',
    address: '海淀区中关村大街1号',
    date: '2026-06-07',
    status: 'confirmed',
    createdAt: '2026-06-04T14:25:00Z',
  },
];
