
import React from 'react';
import { Heart, Minus, X } from 'lucide-react';
import { ReactionType, REACTION_LABELS } from '../types';

interface ReactionSelectorProps {
  selected: ReactionType;
  onChange: (r: ReactionType) => void;
  label?: string;
  colorClass?: string;
}

const ReactionSelector: React.FC<ReactionSelectorProps> = ({ selected, onChange, label, colorClass = 'text-slate-500' }) => {
  const options: { value: ReactionType; icon: React.ReactNode; activeColor: string }[] = [
    { 
      value: 'like', 
      icon: <Heart className={`w-6 h-6 ${selected === 'like' ? 'fill-current' : ''}`} />, 
      activeColor: 'bg-rose-50 text-rose-500 border-rose-200' 
    },
    { 
      value: 'ok', 
      icon: <Minus className="w-6 h-6" />, 
      activeColor: 'bg-slate-100 text-slate-500 border-slate-300' 
    },
    { 
      value: 'dislike', 
      icon: <X className="w-6 h-6" />, 
      activeColor: 'bg-slate-800 text-slate-200 border-slate-600' 
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <span className={`text-xs font-black uppercase tracking-wider ${colorClass}`}>{label}</span>}
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-200 ${
              selected === opt.value
                ? `${opt.activeColor} shadow-sm scale-[1.02]`
                : 'bg-white border-transparent text-slate-300 hover:bg-slate-50'
            }`}
          >
            {opt.icon}
            <span className="text-[10px] font-bold mt-1">{REACTION_LABELS[opt.value]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionSelector;
