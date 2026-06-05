import { useState } from 'react';
import { useStore } from '@/store';
import type { ApplianceCategory, ServiceArea } from '@/types';
import { Plus, Trash2, Edit3, AlertTriangle, MapPin, Check, X } from 'lucide-react';

export default function Admin() {
  const {
    categories, addCategory, updateCategory, deleteCategory,
    serviceAreas, addServiceArea, updateServiceArea, deleteServiceArea,
    loadSampleData, estimations, appointments,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'categories' | 'areas'>('categories');
  const [editingCat, setEditingCat] = useState<ApplianceCategory | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', icon: '', basePrice: 0, hazardous: false, description: '' });

  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);
  const [showAreaForm, setShowAreaForm] = useState(false);
  const [areaForm, setAreaForm] = useState({ name: '', active: true });

  const handleSaveCat = () => {
    if (!catForm.name.trim()) return;
    if (editingCat) {
      updateCategory({ ...editingCat, ...catForm, name: catForm.name.trim() });
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        name: catForm.name.trim(),
        icon: catForm.icon || 'Box',
        basePrice: catForm.basePrice,
        hazardous: catForm.hazardous,
        description: catForm.description,
      });
    }
    resetCatForm();
  };

  const resetCatForm = () => {
    setCatForm({ name: '', icon: '', basePrice: 0, hazardous: false, description: '' });
    setEditingCat(null);
    setShowCatForm(false);
  };

  const startEditCat = (cat: ApplianceCategory) => {
    setCatForm({ name: cat.name, icon: cat.icon, basePrice: cat.basePrice, hazardous: cat.hazardous, description: cat.description });
    setEditingCat(cat);
    setShowCatForm(true);
  };

  const handleSaveArea = () => {
    if (!areaForm.name.trim()) return;
    if (editingArea) {
      updateServiceArea({ ...editingArea, name: areaForm.name.trim(), active: areaForm.active });
    } else {
      addServiceArea({
        id: `area-${Date.now()}`,
        name: areaForm.name.trim(),
        active: areaForm.active,
      });
    }
    resetAreaForm();
  };

  const resetAreaForm = () => {
    setAreaForm({ name: '', active: true });
    setEditingArea(null);
    setShowAreaForm(false);
  };

  const startEditArea = (area: ServiceArea) => {
    setAreaForm({ name: area.name, active: area.active });
    setEditingArea(area);
    setShowAreaForm(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-forest">管理员后台</h1>
          <p className="text-gray-500 mt-1">管理回收品类与服务范围</p>
        </div>
        {estimations.length === 0 && appointments.length === 0 && (
          <button
            onClick={loadSampleData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-light/20 text-amber-dark hover:bg-amber-light/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            加载样例数据
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-forest text-white shadow-lg shadow-forest/20'
              : 'bg-white text-gray-600 hover:bg-forest-50'
          }`}
        >
          品类管理 ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('areas')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'areas'
              ? 'bg-forest text-white shadow-lg shadow-forest/20'
              : 'bg-white text-gray-600 hover:bg-forest-50'
          }`}
        >
          回收范围 ({serviceAreas.filter((a) => a.active).length}/{serviceAreas.length})
        </button>
      </div>

      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { resetCatForm(); setShowCatForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-forest text-white hover:bg-forest-light shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              新增品类
            </button>
          </div>

          {showCatForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-100 mb-6">
              <h3 className="text-lg font-bold text-forest mb-4">
                {editingCat ? '编辑品类' : '新增品类'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">品类名称 *</label>
                  <input
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="如：电视机"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">估价基数 (元) *</label>
                  <input
                    type="number"
                    value={catForm.basePrice}
                    onChange={(e) => setCatForm({ ...catForm, basePrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">描述</label>
                  <input
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="品类描述"
                  />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catForm.hazardous}
                      onChange={(e) => setCatForm({ ...catForm, hazardous: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest"
                    />
                    <span className="text-sm text-gray-600">危险拆解品类</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={resetCatForm}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveCat}
                  disabled={!catForm.name.trim()}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    catForm.name.trim()
                      ? 'bg-forest text-white hover:bg-forest-light'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  保存
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest flex items-center justify-center text-sm font-bold">
                    {cat.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                      {cat.hazardous && (
                        <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          危险拆解
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-forest">¥{cat.basePrice}</span>
                  <button
                    onClick={() => startEditCat(cat)}
                    className="p-2 rounded-lg text-gray-400 hover:text-forest hover:bg-forest-50 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'areas' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { resetAreaForm(); setShowAreaForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-forest text-white hover:bg-forest-light shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              新增区域
            </button>
          </div>

          {showAreaForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-100 mb-6">
              <h3 className="text-lg font-bold text-forest mb-4">
                {editingArea ? '编辑区域' : '新增区域'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">区域名称 *</label>
                  <input
                    value={areaForm.name}
                    onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="如：朝阳区"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={areaForm.active}
                      onChange={(e) => setAreaForm({ ...areaForm, active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest"
                    />
                    <span className="text-sm text-gray-600">启用上门服务</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={resetAreaForm}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveArea}
                  disabled={!areaForm.name.trim()}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    areaForm.name.trim()
                      ? 'bg-forest text-white hover:bg-forest-light'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  保存
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {serviceAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    area.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800">{area.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {area.active ? (
                        <><Check className="w-3 h-3 text-emerald-500" /><span className="text-xs text-emerald-600">已启用</span></>
                      ) : (
                        <><X className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-400">未启用</span></>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateServiceArea({ ...area, active: !area.active })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      area.active
                        ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    {area.active ? '停用' : '启用'}
                  </button>
                  <button
                    onClick={() => startEditArea(area)}
                    className="p-2 rounded-lg text-gray-400 hover:text-forest hover:bg-forest-50 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteServiceArea(area.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
