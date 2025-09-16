import React, { useState, useEffect } from 'react';
import { CalendarView } from './components/CalendarView';
import { KanbanBoard } from './components/KanbanBoard';
import { SettingsModal } from './components/SettingsModal';
import { EmployeeModal } from './components/EmployeeModal';
import { SettingsIcon } from './components/icons';
import { Employee, CalendarConfig } from './types';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [calendars, setCalendars] = useState<CalendarConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初回読み込み時にDBからデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setEmployees(data.employees);
        setCalendars(data.calendars);
      } catch (error) {
        console.error("Failed to fetch data from DB:", error);
        // エラーが発生した場合のフォールバック処理を追加することもできます
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // データをAPI経由で一括保存する汎用関数
  const saveData = async (data: { employees?: Employee[], calendars?: CalendarConfig[] }) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleUpdateEmployeeStatus = (id: string, returnTime: string, destination: string) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === id ? { ...emp, returnTime, destination } : emp
    );
    setEmployees(updatedEmployees);
    saveData({ employees: updatedEmployees }); // DBに保存
    setSelectedEmployee(null);
  };

  // ReactのState更新関数を直接渡せるように修正
  const handleSetEmployees = (newEmployeesOrUpdater: React.SetStateAction<Employee[]>) => {
    const newEmployees = typeof newEmployeesOrUpdater === 'function'
      ? newEmployeesOrUpdater(employees)
      : newEmployeesOrUpdater;
    setEmployees(newEmployees);
    saveData({ employees: newEmployees });
  };

  const handleSetCalendars = (newCalendarsOrUpdater: React.SetStateAction<CalendarConfig[]>) => {
    const newCalendars = typeof newCalendarsOrUpdater === 'function'
      ? newCalendarsOrUpdater(calendars)
      : newCalendarsOrUpdater;
    setCalendars(newCalendars);
    saveData({ calendars: newCalendars });
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center text-gray-500">データベースからデータを読み込んでいます...</div>;
  }

  return (
    <div className="flex h-screen bg-brand-primary text-brand-text font-sans">
      <div className="w-1/2 p-4 flex flex-col h-full">
        <CalendarView calendars={calendars} />
      </div>
      <div className="w-1/2 p-4 border-l border-brand-accent flex flex-col h-full">
        <KanbanBoard employees={employees} onSelectEmployee={handleSelectEmployee} />
      </div>

      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 text-brand-subtle hover:text-brand-text transition-colors duration-200 p-2 rounded-full hover:bg-brand-accent"
        aria-label="設定を開く"
      >
        <SettingsIcon />
      </button>

      {isSettingsOpen && (
        <SettingsModal
          employees={employees}
          setEmployees={handleSetEmployees}
          calendars={calendars}
          setCalendars={handleSetCalendars}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onSave={handleUpdateEmployeeStatus}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default App;