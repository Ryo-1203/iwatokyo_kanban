import React, { useState, ChangeEvent } from 'react';
import { Employee, CalendarConfig } from '../types';
import { CloseIcon, TrashIcon, PlusIcon, EditIcon } from './icons';

interface SettingsModalProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => Promise<void> | void;
  calendars: CalendarConfig[];
  setCalendars: (calendars: CalendarConfig[]) => Promise<void> | void;
  onClose: () => void;
}

type SettingsTab = 'employees' | 'calendars';

const EmployeeSettings: React.FC<{ employees: Employee[]; setEmployees: (employees: Employee[]) => Promise<void> | void }> = ({ employees, setEmployees }) => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      const newEmployee: Employee = {
        id: new Date().toISOString(),
        name: newEmployeeName.trim(),
        returnTime: '',
        destination: ''
      };
      setEmployees(prev => [...prev, newEmployee]);
      setNewEmployeeName('');
    }
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleUpdateEmployee = () => {
    if (editingEmployee && editingEmployee.name.trim()) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp));
      setEditingEmployee(null);
    }
  };
  
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(editingEmployee) {
      setEditingEmployee({...editingEmployee, name: e.target.value});
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">社員の管理</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          placeholder="新しい社員名"
          className="flex-grow bg-brand-primary border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-brand-text"
        />
        <button onClick={handleAddEmployee} className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
            <PlusIcon /> <span className="ml-1 hidden sm:inline">追加</span>
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {employees.map(emp => (
          <div key={emp.id} className="flex items-center justify-between bg-brand-primary p-2 rounded-md border border-brand-accent">
            {editingEmployee?.id === emp.id ? (
              <input 
                type="text"
                value={editingEmployee.name}
                onChange={handleEditChange}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateEmployee()}
                onBlur={handleUpdateEmployee}
                autoFocus
                className="bg-white border border-indigo-500 rounded-md py-1 px-2 flex-grow text-brand-text"
              />
            ) : (
              <span className="text-brand-text">{emp.name}</span>
            )}
            <div className="flex items-center space-x-2">
              {editingEmployee?.id === emp.id ? (
                <button onClick={handleUpdateEmployee} className="text-green-600 hover:text-green-700 font-semibold text-sm">保存</button>
              ) : (
                <button onClick={() => setEditingEmployee(emp)} className="text-brand-subtle hover:text-indigo-600"><EditIcon /></button>
              )}
              <button onClick={() => handleDeleteEmployee(emp.id)} className="text-brand-subtle hover:text-red-600"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalendarSettings: React.FC<{ calendars: CalendarConfig[]; setCalendars: (calendars: CalendarConfig[]) => Promise<void> | void }> = ({ calendars, setCalendars }) => {
  const [newCalName, setNewCalName] = useState('');
  const [newCalSrc, setNewCalSrc] = useState('');

  const handleAddCalendar = () => {
    if (newCalName.trim() && newCalSrc.trim()) {
      const newCal: CalendarConfig = {
        id: new Date().toISOString(),
        name: newCalName.trim(),
        src: newCalSrc.trim()
      };
      setCalendars(prev => [...prev, newCal]);
      setNewCalName('');
      setNewCalSrc('');
    }
  };
  
  const handleDeleteCalendar = (id: string) => {
    setCalendars(prev => prev.filter(cal => cal.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">カレンダーの管理</h3>
      <div className="space-y-2 p-3 bg-brand-primary rounded-md border border-brand-accent">
        <input type="text" value={newCalName} onChange={e => setNewCalName(e.target.value)} placeholder="カレンダー名 (例: 営業チーム)" className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 text-brand-text" />
        <input type="text" value={newCalSrc} onChange={e => setNewCalSrc(e.target.value)} placeholder="Googleカレンダー埋め込みURL" className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 text-brand-text" />
        <button onClick={handleAddCalendar} className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center">
            <PlusIcon /> <span className="ml-2">カレンダーを追加</span>
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {calendars.map(cal => (
          <div key={cal.id} className="flex items-center justify-between bg-brand-primary p-2 rounded-md border border-brand-accent">
            <span className="truncate text-brand-text" title={cal.name}>{cal.name}</span>
            <button onClick={() => handleDeleteCalendar(cal.id)} className="text-brand-subtle hover:text-red-600 flex-shrink-0"><TrashIcon /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ employees, setEmployees, calendars, setCalendars, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('employees');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-2xl relative max-h-[90vh] flex flex-col border border-brand-accent">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-text">設定</h2>
            <button onClick={onClose} className="text-brand-subtle hover:text-brand-text">
              <CloseIcon />
            </button>
        </div>
        
        <div className="border-b border-brand-accent mb-4">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('employees')}
                    className={`${activeTab === 'employees' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-brand-subtle hover:text-brand-text hover:border-gray-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                    社員管理
                </button>
                <button
                    onClick={() => setActiveTab('calendars')}
                    className={`${activeTab === 'calendars' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-brand-subtle hover:text-brand-text hover:border-gray-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                    カレンダー管理
                </button>
            </nav>
        </div>

        <div className="overflow-y-auto flex-grow">
            {activeTab === 'employees' && <EmployeeSettings employees={employees} setEmployees={setEmployees} />}
            {activeTab === 'calendars' && <CalendarSettings calendars={calendars} setCalendars={setCalendars} />}
        </div>
      </div>
    </div>
  );
};