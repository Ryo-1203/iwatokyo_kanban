import React, { useState, useEffect } from 'react';
import { CalendarView } from './components/CalendarView';
import { KanbanBoard } from './components/KanbanBoard';
import { SettingsModal } from './components/SettingsModal';
import { EmployeeModal } from './components/EmployeeModal';
import { SettingsIcon } from './components/icons';
import { Employee, CalendarConfig } from './types';
import { INITIAL_EMPLOYEES, INITIAL_CALENDARS } from './constants';
import { employeesAPI, calendarsAPI } from './lib/api';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [calendars, setCalendars] = useState<CalendarConfig[]>(INITIAL_CALENDARS);
  const [loading, setLoading] = useState<boolean>(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // データベースから初期データを読み込む
  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesData, calendarsData] = await Promise.all([
          employeesAPI.get(),
          calendarsAPI.get()
        ]);

        if (employeesData.length > 0) {
          setEmployees(employeesData);
        }

        if (calendarsData.length > 0) {
          setCalendars(calendarsData);
        }
      } catch (error) {
        console.error('Failed to load data from database:', error);
        // データベース接続エラーの場合は初期データを使用
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateEmployeeStatus = async (id: string, returnTime: string, destination: string) => {
    try {
      const updatedEmployee = await employeesAPI.update({ id, returnTime, destination } as Employee);
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === id ? updatedEmployee : emp
        )
      );
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Failed to update employee:', error);
      // エラーの場合はローカルで更新
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === id ? { ...emp, returnTime, destination } : emp
        )
      );
      setSelectedEmployee(null);
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleSaveEmployees = async (newEmployees: Employee[]) => {
    try {
      await Promise.all(newEmployees.map(emp => employeesAPI.save(emp)));
      setEmployees(newEmployees);
    } catch (error) {
      console.error('Failed to save employees:', error);
      // エラーの場合はローカルで更新
      setEmployees(newEmployees);
    }
  };

  const handleSaveCalendars = async (newCalendars: CalendarConfig[]) => {
    try {
      await Promise.all(newCalendars.map(cal => calendarsAPI.save(cal)));
      setCalendars(newCalendars);
    } catch (error) {
      console.error('Failed to save calendars:', error);
      // エラーの場合はローカルで更新
      setCalendars(newCalendars);
    }
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
          setEmployees={handleSaveEmployees}
          calendars={calendars}
          setCalendars={handleSaveCalendars}
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