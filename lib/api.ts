import { Employee, CalendarConfig } from '../types';

const API_BASE_URL = '/api';

// Employees API
export const employeesAPI = {
  async get(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return response.json();
  },

  async update(employee: Employee): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      throw new Error('Failed to update employee');
    }
    return response.json();
  },

  async save(employee: Employee): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      throw new Error('Failed to save employee');
    }
    return response.json();
  },
};

// Calendars API
export const calendarsAPI = {
  async get(): Promise<CalendarConfig[]> {
    const response = await fetch(`${API_BASE_URL}/calendars`);
    if (!response.ok) {
      throw new Error('Failed to fetch calendars');
    }
    return response.json();
  },

  async save(calendar: CalendarConfig): Promise<CalendarConfig> {
    const response = await fetch(`${API_BASE_URL}/calendars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendar),
    });
    if (!response.ok) {
      throw new Error('Failed to save calendar');
    }
    return response.json();
  },
};