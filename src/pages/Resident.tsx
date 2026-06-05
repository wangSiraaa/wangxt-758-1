import { useState } from 'react';
import { useStore } from '@/store';
import type { ConditionLevel, ApplianceCategory } from '@/types';
import { CONDITION_MULTIPLIERS, CONDITION_LABELS } from '@/types';
import { CategoryGrid, default as ConditionSelector } from '@/components/ConditionSelector';
import { CalendarDays, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Resident() {
  const { categories, addEstimation, addAppointment, hasDuplicateAppointment, estimations } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<ApplianceCategory | null>(null);
  const [conditionLevel, setConditionLevel] = useState<ConditionLevel | ''>('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [residentName, setResidentName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [showConditionHint, setShowConditionHint] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleEstimate = () => {
    if (!selectedCategory || !conditionLevel) {
      setShowConditionHint(true);
      return;
    }
    setShowConditionHint(false);
    const price = Math.round(selectedCategory.basePrice * CONDITION_MULTIPLIERS[conditionLevel]);
    setEstimatedPrice(price);
  };

  const handleConditionChange = (c: ConditionLevel) => {
    setConditionLevel(c);
    setShowConditionHint(false);
    setEstimatedPrice(null);
  };

  const handleSubmit = () => {
    if (!selectedCategory || !conditionLevel || estimatedPrice === null) return;
    if (!residentName.trim() || !phone.trim()) return;

    const estId = `est-${Date.now()}`;
    addEstimation({
      id: estId,
      categoryId: selectedCategory.id,
      conditionLevel,
      estimatedPrice,
      residentName: residentName.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    });

    if (address.trim() && date && !selectedCategory.hazardous) {
      if (hasDuplicateAppointment(address.trim(), date)) {
        setAppointmentError('该地址今日已有预约，同一地址同日仅可预约一次');
        return;
      }
      addAppointment({
        id: `apt-${Date.now()}`,
        estimationId: estId,
        address: address.trim(),
        date,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    setSuccessMsg('估价已提交成功！');
    setTimeout(() => {
      setSelectedCategory(null);
      setConditionLevel('');
      setEstimatedPrice(null);
      setResidentName('');
      setPhone('');
      setAddress('');
      setDate('');
      setAppointmentError('');
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-forest">家电回收估价</h1>
        <p className="text-gray-500 mt-1">选择品类、填写成色，即时获取估价</p>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-emerald-700 font-medium">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100">
            <h2 className="text-base font-bold text-forest mb-4">选择品类</h2>
            <CategoryGrid
              selectedId={selectedCategory?.id ?? null}
              onSelect={(cat) => {
                setSelectedCategory(cat);
                setConditionLevel('');
                setEstimatedPrice(null);
                setShowConditionHint(false);
                setAppointmentError('');
              }}
            />
          </div>
        </div>

        <div className="col-span-8">
          <ConditionSelector
            category={selectedCategory}
            selectedCondition={conditionLevel}
            onConditionChange={handleConditionChange}
            estimatedPrice={estimatedPrice}
            onEstimate={handleEstimate}
            showConditionHint={showConditionHint}
          />

          {estimatedPrice !== null && (
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-forest-100">
              <h3 className="text-lg font-bold text-forest mb-4">联系信息与预约</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">姓名 *</label>
                  <input
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">手机号 *</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="请输入手机号"
                  />
                </div>
              </div>

              {selectedCategory && !selectedCategory.hazardous && (
                <>
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarDays className="w-4 h-4 text-forest" />
                      <span className="text-sm font-medium text-forest">上门预约（可选）</span>
                    </div>

                    {appointmentError && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm text-red-700">{appointmentError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          <MapPin className="w-3.5 h-3.5 inline mr-1" />
                          回收地址
                        </label>
                        <input
                          value={address}
                          onChange={(e) => { setAddress(e.target.value); setAppointmentError(''); }}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                          placeholder="请输入详细地址"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
                          预约日期
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => { setDate(e.target.value); setAppointmentError(''); }}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!residentName.trim() || !phone.trim()}
                  className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    residentName.trim() && phone.trim()
                      ? 'bg-forest text-white hover:bg-forest-light shadow-lg shadow-forest/30 hover:shadow-xl hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  提交估价{address && date && !selectedCategory?.hazardous ? '并预约' : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
