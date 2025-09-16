import { Employee, CalendarConfig } from './types';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice', returnTime: '', destination: '' },
  { id: '2', name: 'Bob', returnTime: '14:00', destination: 'Client Meeting' },
  { id: '3', name: 'Charlie', returnTime: '', destination: '' },
  { id: '4', name: 'Diana', returnTime: '15:30', destination: 'Lunch' },
  { id: '5', name: 'Ethan', returnTime: '', destination: '' },
  { id: '6', name: 'Fiona', returnTime: '13:00', destination: 'Supplier Visit' },
];

export const INITIAL_CALENDARS: CalendarConfig[] = [
    { 
        id: '1', 
        name: '会社の祝日', 
        src: 'https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo' 
    },
    { 
        id: '2', 
        name: '営業チーム', 
        src: '' // Add your embed URL here
    },
];

export const BOARD_STATUS = {
    IN_OFFICE: '在席',
    AWAY: '離席・外出'
};