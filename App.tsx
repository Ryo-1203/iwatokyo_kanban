import React, { useState } from 'react';
import { CalendarView } from './components/CalendarView';
import { KanbanBoard } from './components/KanbanBoard';
import { SettingsModal } from './components/SettingsModal';
import { EmployeeModal } from './components/EmployeeModal';
import { SettingsIcon } from './components/icons';
import { Employee, CalendarConfig } from './types';
import { INITIAL_EMPLOYEES, INITIAL_CALENDARS } from './constants';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [calendars, setCalendars] = useState<CalendarConfig[]>(INITIAL_CALENDARS);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleUpdateEmployeeStatus = (id: string, returnTime: string, destination: string) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, returnTime, destination } : emp
      )
    );
    setSelectedEmployee(null);
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  
  return (
    <div className="flex h-screen bg-brand-primary text-brand-text font-sans">
      <div className="w-1/2 p-4 flex flex-col h-full">
        <CalendarView 
          calendars={calendars} 
        />
      </div>
      <div className="w-1/2 p-4 border-l border-brand-accent flex flex-col h-full">
        <KanbanBoard 
          employees={employees} 
          onSelectEmployee={handleSelectEmployee} 
        />
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
          setEmployees={setEmployees}
          calendars={calendars}
          setCalendars={setCalendars}
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