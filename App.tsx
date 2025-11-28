
import React, { useState, useEffect } from 'react';
import { PlusCircle, List, Plus } from 'lucide-react';
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
    <div className="h-full flex flex-col w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation Bar - Grid 2 columns for balance */}
      <nav className="h-16 bg-white border-t border-slate-100 z-50 absolute bottom-0 w-full grid grid-cols-2">
        {/* Record Button (Left) */}
        <button
          onClick={() => setActiveTab(AppTab.HISTORY)}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === AppTab.HISTORY ? 'bg-slate-50 text-brand-600' : 'bg-white text-slate-300 hover:text-slate-500'
          }`}
        >
          <List className={`w-6 h-6 ${activeTab === AppTab.HISTORY ? 'stroke-brand-600' : 'stroke-current'}`} />
          <span className="text-xs font-bold leading-none">記錄</span>
        </button>

        {/* Add Button (Right) */}
        <button
            onClick={handleAddClick}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === AppTab.ADD 
              ? 'bg-slate-50 text-brand-600' 
              : 'bg-white text-slate-300 hover:text-slate-500'
            }`}
        >
            {editingRecord ? (
               <EditIcon />
            ) : (
               <Plus className={`w-6 h-6 ${activeTab === AppTab.ADD ? 'stroke-brand-600' : 'stroke-current'}`} />
            )}
            <span className="text-xs font-bold leading-none">
                {editingRecord ? '編輯' : '新增'}
            </span>
        </button>
      </nav>
    </div>
  );
};

// Simple Edit Icon component for clarity
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
)

export default App;
