import { useState, useRef } from 'react';
import { useStore } from '@/store';
import type { ConditionLevel, ApplianceCategory, Estimation } from '@/types';
import { CONDITION_MULTIPLIERS, CONDITION_LABELS } from '@/types';
import { CategoryGrid, default as ConditionSelector } from '@/components/ConditionSelector';
import { CalendarDays, MapPin, AlertCircle, CheckCircle2, Printer } from 'lucide-react';

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
  const [lastEstimation, setLastEstimation] = useState<Estimation | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const generateBusinessNo = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const todayCount = estimations.filter((e) => e.createdAt.startsWith(now.toISOString().slice(0, 10))).length + 1;
    return `BIZ${dateStr}${String(todayCount).padStart(4, '0')}`;
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>废旧家电回收估价清单</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
            .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .print-title { font-size: 24px; font-weight: 900; color: #059669; margin: 0 0 10px 0; }
            .print-subtitle { font-size: 14px; color: #6b7280; }
            .biz-no { font-size: 16px; font-weight: bold; color: #374151; margin-top: 10px; }
            .info-section { margin: 20px 0; }
            .info-row { display: flex; margin: 8px 0; font-size: 14px; }
            .info-label { width: 100px; color: #6b7280; font-weight: 500; }
            .info-value { flex: 1; color: #1f2937; }
            .price-section { background: #ecfdf5; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; }
            .price-label { font-size: 14px; color: #047857; margin-bottom: 8px; }
            .price-value { font-size: 36px; font-weight: 900; color: #059669; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .hint-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
            .hint-text { font-size: 13px; color: #92400e; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

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
    const businessNo = generateBusinessNo();
    const now = new Date().toISOString();

    const estimationData: Estimation = {
      id: estId,
      businessNo,
      categoryId: selectedCategory.id,
      conditionLevel,
      estimatedPrice,
      residentName: residentName.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
      appointmentDate: date || undefined,
      createdAt: now,
    };

    addEstimation(estimationData);
    setLastEstimation(estimationData);

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
        createdAt: now,
      });
    }

    setSuccessMsg(`估价已提交成功！业务编号：${businessNo}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-forest">家电回收估价</h1>
        <p className="text-gray-500 mt-1">选择品类、填写成色，即时获取估价</p>
      </div>

      {successMsg && lastEstimation && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-medium">{successMsg}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setConditionLevel('');
                  setEstimatedPrice(null);
                  setResidentName('');
                  setPhone('');
                  setAddress('');
                  setDate('');
                  setAppointmentError('');
                  setSuccessMsg('');
                  setLastEstimation(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white text-forest border border-forest-200 hover:bg-forest-50 transition-colors"
              >
                继续估价
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-forest text-white hover:bg-forest-light shadow-md hover:shadow-lg transition-all"
              >
                <Printer className="w-4 h-4" />
                打印清单
              </button>
            </div>
          </div>
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

      <div ref={printRef} style={{ display: 'none' }}>
        {lastEstimation && (
          <>
            <div className="print-header">
              <h1 className="print-title">废旧家电回收估价清单</h1>
              <p className="print-subtitle">专业回收 · 绿色环保 · 价格透明</p>
              <div className="biz-no">业务编号：{lastEstimation.businessNo}</div>
            </div>

            <div className="info-section">
              <div className="info-row">
                <span className="info-label">家电品类</span>
                <span className="info-value">{categories.find(c => c.id === lastEstimation.categoryId)?.name || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">成色等级</span>
                <span className="info-value">{lastEstimation.conditionLevel ? CONDITION_LABELS[lastEstimation.conditionLevel] : '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">估价基数</span>
                <span className="info-value">¥{categories.find(c => c.id === lastEstimation.categoryId)?.basePrice || 0}</span>
              </div>
              <div className="info-row">
                <span className="info-label">折算比例</span>
                <span className="info-value">{lastEstimation.conditionLevel ? CONDITION_MULTIPLIERS[lastEstimation.conditionLevel] * 100 : 0}%</span>
              </div>
            </div>

            <div className="price-section">
              <p className="price-label">预估回收价格</p>
              <p className="price-value">¥{lastEstimation.estimatedPrice || 0}</p>
            </div>

            <div className="info-section">
              <div className="info-row">
                <span className="info-label">居民姓名</span>
                <span className="info-value">{lastEstimation.residentName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">联系电话</span>
                <span className="info-value">{lastEstimation.phone}</span>
              </div>
              {lastEstimation.address && (
                <div className="info-row">
                  <span className="info-label">回收地址</span>
                  <span className="info-value">{lastEstimation.address}</span>
                </div>
              )}
              {lastEstimation.appointmentDate && (
                <div className="info-row">
                  <span className="info-label">预约日期</span>
                  <span className="info-value">{lastEstimation.appointmentDate}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">估价时间</span>
                <span className="info-value">{new Date(lastEstimation.createdAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>

            {categories.find(c => c.id === lastEstimation.categoryId)?.hazardous && (
              <div className="hint-box">
                <p className="hint-text">⚠️ 该品类为危险拆解品类，不支持上门回收，请您送至指定回收点</p>
              </div>
            )}

            <div className="footer">
              <p>本清单仅作估价参考，实际回收价格以现场检测为准</p>
              <p>感谢您对环保事业的支持！</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
