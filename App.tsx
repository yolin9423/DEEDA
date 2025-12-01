
import React, { useState, useEffect } from 'react';
import { List, Plus, Edit2 } from 'lucide-react';
import AddFood from './components/AddFood';
import FoodList from './components/FoodList';
import { AppTab, FoodRecord } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HISTORY);
  const [records, setRecords] = useState<FoodRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<FoodRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [appTitle, setAppTitle] = useState("小朋友の吃不吃挑戰");

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('petFoodRecords');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) {
      setAppTitle(savedTitle);
    }
    setLoading(false);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('petFoodRecords', JSON.stringify(records));
    }
  }, [records, loading]);

  const handleTitleChange = (newTitle: string) => {
    setAppTitle(newTitle);
    localStorage.setItem('appTitle', newTitle);
  };

  const handleSaveRecord = (record: FoodRecord) => {
    setRecords(prev => {
        const exists = prev.findIndex(r => r.id === record.id);
        if (exists >= 0) {
            const newRecords = [...prev];
            newRecords[exists] = record;
            return newRecords;
        }
        return [record, ...prev];
    });
    setEditingRecord(null);
    setActiveTab(AppTab.HISTORY);
  };

  const handleEditRequest = (record: FoodRecord) => {
      setEditingRecord(record);
      setActiveTab(AppTab.ADD);
  };

  const handleCancelEdit = () => {
      setEditingRecord(null);
      setActiveTab(AppTab.HISTORY);
  };

  const handleAddClick = () => {
      setEditingRecord(null);
      setActiveTab(AppTab.ADD);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.ADD:
        return <AddFood onSave={handleSaveRecord} initialData={editingRecord} onCancel={handleCancelEdit} />;
      case AppTab.HISTORY:
        return <FoodList records={records} onEdit={handleEditRequest} title={appTitle} onTitleChange={handleTitleChange} />;
      default:
        return <FoodList records={records} onEdit={handleEditRequest} title={appTitle} onTitleChange={handleTitleChange} />;
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center bg-brand-50 text-brand-500">Loading...</div>;

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      
      {/* Main Content Area - Full Height */}
      <main className="h-full w-full overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Floating Pill Navigation */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center mb-[env(safe-area-inset-bottom)] pointer-events-none">
        <nav className="pointer-events-auto bg-white/90 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full p-1.5 flex gap-1 w-[280px]">
            {/* Record Button */}
            <button
                onClick={() => setActiveTab(AppTab.HISTORY)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 ${
                    activeTab === AppTab.HISTORY 
                    ? 'bg-slate-100 text-brand-600 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <List className={`w-5 h-5 ${activeTab === AppTab.HISTORY ? 'stroke-brand-600 stroke-[2.5px]' : 'stroke-current'}`} />
                <span className={`text-xs font-bold ${activeTab === AppTab.HISTORY ? 'opacity-100' : 'opacity-0 hidden'}`}>記錄</span>
            </button>

            {/* Add Button */}
            <button
                onClick={handleAddClick}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 ${
                    activeTab === AppTab.ADD 
                    ? 'bg-slate-100 text-brand-600 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                {editingRecord ? (
                    <Edit2 className="w-5 h-5 stroke-brand-600 stroke-[2.5px]" />
                ) : (
                    <Plus className={`w-5 h-5 ${activeTab === AppTab.ADD ? 'stroke-brand-600 stroke-[2.5px]' : 'stroke-current'}`} />
                )}
                <span className={`text-xs font-bold ${activeTab === AppTab.ADD ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {editingRecord ? '編輯' : '新增'}
                </span>
            </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
