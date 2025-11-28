
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, Camera, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { FoodRecord, ReactionType, PETS, PetId } from '../types';
import ReactionSelector from './ReactionSelector';

interface AddFoodProps {
  onSave: (record: FoodRecord) => void;
  onCancel?: () => void;
  initialData?: FoodRecord | null;
}

const AddFood: React.FC<AddFoodProps> = ({ onSave, onCancel, initialData }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<FoodRecord['type']>('wet');
  const [reactions, setReactions] = useState<Record<PetId, ReactionType>>({
    kodee: 'like',
    eda: 'like'
  });
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBrand(initialData.brand);
      setType(initialData.type);
      setReactions(initialData.reactions);
      setNotes(initialData.notes);
      setImagePreview(initialData.imageUrl || null);
    }
  }, [initialData]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateReaction = (pet: PetId, reaction: ReactionType) => {
    setReactions(prev => ({ ...prev, [pet]: reaction }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const record: FoodRecord = {
      id: initialData ? initialData.id : generateId(),
      name,
      brand,
      type,
      reactions,
      notes,
      date: initialData ? initialData.date : new Date().toISOString(),
      imageUrl: imagePreview || undefined,
    };

    onSave(record);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 pb-24">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {initialData ? (
                <RefreshCw className="w-6 h-6 text-brand-500" />
            ) : (
                <Plus className="w-6 h-6 text-brand-500" />
            )}
            {initialData ? '編輯紀錄' : '新增紀錄'}
            </h2>
            {initialData && onCancel && (
                <button onClick={onCancel} className="text-sm font-bold text-slate-400 p-2">取消</button>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="flex justify-center">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden" 
            />
            {imagePreview ? (
              <div className="relative w-40 h-40">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white" />
                <button 
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white hover:bg-slate-50 transition-colors gap-2"
              >
                <div className="p-3 bg-brand-50 rounded-full">
                    <Camera className="w-6 h-6 text-brand-500" />
                </div>
                <span className="text-sm font-medium">上傳照片 (方形)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">參戰選手</label>
                <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="雞肉凍乾"
                className="w-full px-3 py-3 rounded-xl border-none shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">品牌</label>
                <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="汪喵星球"
                className="w-full px-3 py-3 rounded-xl border-none shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
            </div>
          </div>

          {/* Type Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">種類</label>
            <div className="flex gap-2 p-1 bg-white rounded-xl ring-1 ring-slate-200">
              {(['wet', 'puree', 'treat'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    type === t
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t === 'wet' && '罐罐'}
                  {t === 'puree' && '肉泥'}
                  {t === 'treat' && '零食'}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Reaction Input */}
          <div className="bg-white p-5 rounded-2xl ring-1 ring-slate-200 shadow-sm space-y-6">
             <ReactionSelector 
                label="KODEE" 
                selected={reactions.kodee} 
                onChange={(r) => updateReaction('kodee', r)}
                colorClass={PETS.kodee.color}
            />
             <div className="h-px bg-slate-100 w-full"></div>
             <ReactionSelector 
                label="EDA" 
                selected={reactions.eda} 
                onChange={(r) => updateReaction('eda', r)}
                colorClass={PETS.eda.color}
             />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {initialData ? '更新紀錄' : '儲存紀錄'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
