
import React, { useState } from 'react';
import { Search, Image as ImageIcon, Heart, Minus, X, Edit, Calendar } from 'lucide-react';
import { FoodRecord, ReactionType, FOOD_TYPE_LABELS, PETS, REACTION_LABELS } from '../types';

interface FoodListProps {
  records: FoodRecord[];
  onEdit: (record: FoodRecord) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const FoodList: React.FC<FoodListProps> = ({ records, onEdit, title, onTitleChange }) => {
  const [filterText, setFilterText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewRecord, setPreviewRecord] = useState<FoodRecord | null>(null);

  const filteredRecords = records.filter(record => {
    const matchesText = record.name.toLowerCase().includes(filterText.toLowerCase()) || 
                        record.brand.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesText && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getReactionIcon = (type: ReactionType) => {
      switch(type) {
          case 'like': return <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />;
          case 'ok': return <Minus className="w-5 h-5 text-slate-400" />;
          case 'dislike': return <X className="w-5 h-5 text-slate-800" />;
      }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 relative pb-28">
      
      {/* Breathable Editable Title Section */}
      <div className="pt-20 pb-10 px-6">
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="輸入標題..."
          className="w-full text-3xl font-black text-slate-800 text-center bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 font-sans"
        />
      </div>

      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-sm shadow-sm">
        {/* Search & Filters */}
        <div className="px-4 py-3">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <button 
               onClick={() => setSelectedType('all')}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedType === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 shadow-sm'}`}>
               全部
            </button>
            <button 
               onClick={() => setSelectedType('wet')}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedType === 'wet' ? 'bg-brand-500 text-white' : 'bg-white text-slate-500 shadow-sm'}`}>
               罐罐
            </button>
            <button 
               onClick={() => setSelectedType('puree')}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedType === 'puree' ? 'bg-brand-500 text-white' : 'bg-white text-slate-500 shadow-sm'}`}>
               肉泥
            </button>
             <button 
               onClick={() => setSelectedType('treat')}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedType === 'treat' ? 'bg-brand-500 text-white' : 'bg-white text-slate-500 shadow-sm'}`}>
               零食
            </button>
          </div>
        </div>

        {/* Table Header Row */}
        <div className="grid grid-cols-[60px_1fr_48px_48px] gap-2 px-3 py-2 bg-slate-100 font-bold text-slate-400 uppercase tracking-wider border-y border-slate-200 text-[10px]">
           <div className="text-center flex items-center justify-center">照片</div>
           <div className="flex items-center">參戰選手</div>
           <div className="text-center text-blue-400 flex items-center justify-center font-normal">K</div>
           <div className="text-center text-purple-400 flex items-center justify-center font-normal">E</div>
        </div>
      </div>

      {/* List Content */}
      <div className="pb-8">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-sm">沒有相關記錄</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div 
                key={record.id} 
                onClick={() => setPreviewRecord(record)}
                className="grid grid-cols-[60px_1fr_48px_48px] gap-2 p-3 bg-white border-b border-slate-100 items-center hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              {/* Image */}
              <div className="w-[60px] h-[60px] rounded-lg overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center relative">
                {record.imageUrl ? (
                  <img src={record.imageUrl} alt={record.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                )}
                {/* Type Badge absolute on image */}
                <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-[2px] text-white text-[9px] text-center py-0.5">
                    {FOOD_TYPE_LABELS[record.type]}
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0 pr-1 flex flex-col justify-center h-full">
                {record.brand && <span className="text-xs text-brand-600 font-bold truncate mb-0.5">{record.brand}</span>}
                <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{record.name}</h3>
              </div>

              {/* Reactions - Centered - Compact */}
              <div className={`flex flex-col items-center justify-center h-12 rounded-lg ${PETS.kodee.bg}`}>
                {getReactionIcon(record.reactions.kodee)}
              </div>
              
              <div className={`flex flex-col items-center justify-center h-12 rounded-lg ${PETS.eda.bg}`}>
                {getReactionIcon(record.reactions.eda)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setPreviewRecord(null)}
              className="absolute top-3 right-3 z-10 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Banner */}
            <div className="h-64 bg-slate-100 relative flex items-center justify-center">
               {previewRecord.imageUrl ? (
                  <img src={previewRecord.imageUrl} className="w-full h-full object-cover" alt={previewRecord.name} />
               ) : (
                  <ImageIcon className="w-16 h-16 text-slate-300" />
               )}
               <div className="absolute bottom-4 left-4">
                  <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {FOOD_TYPE_LABELS[previewRecord.type]}
                  </span>
               </div>
            </div>

            <div className="p-6">
                {/* Header Info */}
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-brand-600">{previewRecord.brand}</span>
                        <div className="flex items-center text-xs text-slate-400 gap-1">
                             <Calendar className="w-3 h-3" />
                             {formatDate(previewRecord.date)}
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">{previewRecord.name}</h2>
                </div>

                {/* Reactions Display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${PETS.kodee.bg} flex flex-col items-center gap-2`}>
                        <span className="text-xs font-black text-blue-400 tracking-widest uppercase">{PETS.kodee.name}</span>
                        <div className="scale-125">{getReactionIcon(previewRecord.reactions.kodee)}</div>
                        <span className="text-xs font-bold text-slate-600">{REACTION_LABELS[previewRecord.reactions.kodee]}</span>
                    </div>
                    <div className={`p-4 rounded-xl ${PETS.eda.bg} flex flex-col items-center gap-2`}>
                        <span className="text-xs font-black text-purple-400 tracking-widest uppercase">{PETS.eda.name}</span>
                        <div className="scale-125">{getReactionIcon(previewRecord.reactions.eda)}</div>
                        <span className="text-xs font-bold text-slate-600">{REACTION_LABELS[previewRecord.reactions.eda]}</span>
                    </div>
                </div>

                {/* Notes */}
                {previewRecord.notes && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">筆記</h4>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{previewRecord.notes}</p>
                    </div>
                )}
                
                {/* Action Buttons */}
                <button
                    onClick={() => {
                        onEdit(previewRecord);
                        setPreviewRecord(null);
                    }}
                    className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-[0.98] transition-all shadow-lg"
                >
                    <Edit className="w-4 h-4" />
                    編輯紀錄
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;
