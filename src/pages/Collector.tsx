import { useState } from 'react';
import { useStore } from '@/store';
import { CONDITION_LABELS, APPOINTMENT_STATUS_LABELS } from '@/types';
import type { AppointmentStatus } from '@/types';
import { ClipboardList, Calendar, Filter, ChevronRight } from 'lucide-react';

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-light/20 text-amber-dark',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function Collector() {
  const { estimations, appointments, categories, updateAppointmentStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'estimations' | 'appointments'>('estimations');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '未知';
  const getCategory = (id: string) => categories.find((c) => c.id === id);

  const filteredAppointments = appointments.filter(
    (a) => statusFilter === 'all' || a.status === statusFilter,
  );

  const getEstimationForAppointment = (estId: string) =>
    estimations.find((e) => e.id === estId);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-forest">回收员工作台</h1>
        <p className="text-gray-500 mt-1">查看估价记录、管理上门预约</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('estimations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'estimations'
              ? 'bg-forest text-white shadow-lg shadow-forest/20'
              : 'bg-white text-gray-600 hover:bg-forest-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          估价记录 ({estimations.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'appointments'
              ? 'bg-forest text-white shadow-lg shadow-forest/20'
              : 'bg-white text-gray-600 hover:bg-forest-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          预约管理 ({appointments.length})
        </button>
      </div>

      {activeTab === 'estimations' && (
        <div className="bg-white rounded-2xl shadow-sm border border-forest-100 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-forest-50 text-xs font-bold text-forest uppercase tracking-wider">
            <span>品类</span>
            <span>成色</span>
            <span>估价</span>
            <span>姓名</span>
            <span>电话</span>
            <span>时间</span>
          </div>
          {estimations.length === 0 ? (
            <div className="py-16 text-center text-gray-300">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无估价记录</p>
            </div>
          ) : (
            estimations.map((est) => {
              const cat = getCategory(est.categoryId);
              return (
                <div
                  key={est.id}
                  className="grid grid-cols-6 gap-4 px-6 py-4 border-t border-gray-50 hover:bg-forest-50/50 transition-colors items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-forest-50 text-forest flex items-center justify-center text-xs font-bold">
                      {getCategoryName(est.categoryId)[0]}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {getCategoryName(est.categoryId)}
                    </span>
                    {cat?.hazardous && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">危</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {est.conditionLevel ? CONDITION_LABELS[est.conditionLevel] : '-'}
                  </span>
                  <span className="text-sm font-bold text-forest">
                    {est.estimatedPrice !== null ? `¥${est.estimatedPrice}` : '-'}
                  </span>
                  <span className="text-sm text-gray-600">{est.residentName}</span>
                  <span className="text-sm text-gray-500">{est.phone}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(est.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">筛选：</span>
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-forest text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? '全部' : APPOINTMENT_STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="py-16 text-center text-gray-300 bg-white rounded-2xl border border-forest-100">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无预约记录</p>
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const est = getEstimationForAppointment(apt.estimationId);
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-forest">
                          {est ? getCategoryName(est.categoryId) : '未知品类'}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[apt.status]}`}>
                          {APPOINTMENT_STATUS_LABELS[apt.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPinIcon />
                          {apt.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {apt.date}
                        </span>
                        {est && (
                          <span className="font-bold text-forest">¥{est.estimatedPrice}</span>
                        )}
                      </div>
                      {est && (
                        <div className="text-xs text-gray-400 mt-1">
                          {est.residentName} · {est.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-forest text-white hover:bg-forest-light transition-colors"
                          >
                            确认
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            取消
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          完成回收
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
