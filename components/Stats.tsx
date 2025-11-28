import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { FoodRecord } from '../types';

interface StatsProps {
  records: FoodRecord[];
}

const Stats: React.FC<StatsProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-2">尚無數據</h2>
        <p className="text-slate-500">快去紀錄第一罐罐罐吧！</p>
      </div>
    );
  }

  // Simple Logic: How many do both love?
  // Fix: changed 'love' to 'like' to match ReactionType
  const bothLove = records.filter(r => r.reactions.kodee === 'like' && r.reactions.eda === 'like').length;
  // Fix: changed 'love' to 'like' to match ReactionType
  const onlyKodeeLoves = records.filter(r => r.reactions.kodee === 'like' && r.reactions.eda !== 'like').length;
  // Fix: changed 'love' to 'like' to match ReactionType
  const onlyEdaLoves = records.filter(r => r.reactions.kodee !== 'like' && r.reactions.eda === 'like').length;
  const others = records.length - bothLove - onlyKodeeLoves - onlyEdaLoves;

  const data = [
    { name: '都超愛', value: bothLove, color: '#f43f5e' }, // Rose
    { name: 'Kodee 愛', value: onlyKodeeLoves, color: '#2563eb' }, // Blue
    { name: 'Eda 愛', value: onlyEdaLoves, color: '#d97706' }, // Amber
    { name: '其他', value: others, color: '#cbd5e1' }, // Slate
  ].filter(d => d.value > 0);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">喜好分析</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col items-center">
        <div className="text-sm font-bold text-slate-400 uppercase mb-4">雙寶皆大歡喜</div>
        <div className="text-6xl font-black text-brand-500">{bothLove}</div>
        <div className="text-slate-400 text-xs mt-2">項紀錄</div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
        <h3 className="text-lg font-bold text-slate-700 mb-4 text-center">分佈圖</h3>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;