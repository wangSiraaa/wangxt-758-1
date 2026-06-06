import { useStore } from '@/store';
import { CONDITION_LABELS, CONDITION_MULTIPLIERS } from '@/types';
import type { ConditionLevel, ApplianceCategory } from '@/types';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  category: ApplianceCategory | null;
  selectedCondition: ConditionLevel | '';
  onConditionChange: (c: ConditionLevel) => void;
  estimatedPrice: number | null;
  onEstimate: () => void;
  showConditionHint: boolean;
}

const CONDITION_LEVELS: ConditionLevel[] = ['brand_new', 'ninety_pct', 'seventy_pct', 'fifty_pct', 'unusable'];

const CONDITION_COLORS: Record<ConditionLevel, string> = {
  brand_new: 'bg-emerald-500 text-white',
  ninety_pct: 'bg-emerald-400 text-white',
  seventy_pct: 'bg-amber text-white',
  fifty_pct: 'bg-orange-400 text-white',
  unusable: 'bg-red-400 text-white',
};

export default function ConditionSelector({
  category,
  selectedCondition,
  onConditionChange,
  estimatedPrice,
  onEstimate,
  showConditionHint,
}: Props) {
  if (!category) {
    return (
      <div className="flex items-center justify-center h-64 text-forest-light/50">
        <p className="text-lg">← 请先选择一个家电品类</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-100">
        <h3 className="text-lg font-bold text-forest mb-1">{category.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{category.description}</p>

        {category.hazardous && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-sm text-red-700 font-medium">危险拆解品类，不支持上门回收</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>估价基数：</span>
          <span className="text-forest font-bold text-lg">¥{category.basePrice}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-100">
        <h3 className="text-lg font-bold text-forest mb-4">选择成色等级</h3>

        <div className="grid grid-cols-5 gap-3">
          {CONDITION_LEVELS.map((level) => {
            const isSelected = selectedCondition === level;
            return (
              <button
                key={level}
                onClick={() => onConditionChange(level)}
                className={`relative rounded-xl p-4 text-center transition-all duration-300 border-2 ${
                  isSelected
                    ? 'border-forest shadow-lg scale-105'
                    : 'border-gray-100 hover:border-forest-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold ${
                  isSelected ? CONDITION_COLORS[level] : 'bg-gray-100 text-gray-400'
                }`}>
                  {CONDITION_MULTIPLIERS[level] * 100}%
                </div>
                <p className={`text-xs font-medium ${isSelected ? 'text-forest' : 'text-gray-500'}`}>
                  {CONDITION_LABELS[level]}
                </p>
              </button>
            );
          })}
        </div>

        {showConditionHint && (
          <div className="flex items-center gap-2 mt-4 bg-amber-light/20 border border-amber/30 rounded-xl px-4 py-3">
            <X className="w-4 h-4 text-amber-dark shrink-0" />
            <span className="text-sm text-amber-dark font-medium">请先选择成色等级，才能进行估价</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-forest">估价结果</h3>
          <button
            onClick={onEstimate}
            disabled={!selectedCondition}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              selectedCondition
                ? 'bg-forest text-white hover:bg-forest-light shadow-lg shadow-forest/30 hover:shadow-xl hover:shadow-forest/40 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            立即估价
          </button>
        </div>

        {!selectedCondition ? (
          <div className="flex items-center gap-3 py-6 px-4 bg-amber-light/20 border border-amber/30 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-dark shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-dark mb-0.5">请先选择成色等级</p>
              <p className="text-xs text-amber-dark/70">估价需要根据家电成色等级进行计算，请在上方选择对应的成色</p>
            </div>
          </div>
        ) : estimatedPrice !== null ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-2">预估回收价</p>
            <p className="text-5xl font-black text-forest">
              ¥{estimatedPrice}
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>基数 ¥{category.basePrice}</span>
              <span>×</span>
              <span>成色 {CONDITION_MULTIPLIERS[selectedCondition as ConditionLevel] * 100}%</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-300">
            <p className="text-sm">点击"立即估价"按钮获取回收价格</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryGrid({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (cat: ApplianceCategory) => void;
}) {
  const { categories } = useStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat) => {
        const isSelected = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className={`relative rounded-2xl p-4 text-left transition-all duration-300 border-2 ${
              isSelected
                ? 'border-forest bg-forest-50 shadow-lg'
                : 'border-transparent bg-white hover:border-forest-300 hover:shadow-md'
            }`}
          >
            {cat.hazardous && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                危险
              </div>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
              isSelected ? 'bg-forest text-white' : 'bg-forest-50 text-forest'
            }`}>
              <span className="text-lg font-bold">{cat.name[0]}</span>
            </div>
            <p className={`text-sm font-bold ${isSelected ? 'text-forest' : 'text-gray-700'}`}>
              {cat.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">¥{cat.basePrice}起</p>
          </button>
        );
      })}
    </div>
  );
}
