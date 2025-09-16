import React, { useMemo } from 'react';
import { CalendarConfig } from '../types';

interface CalendarViewProps {
  calendars: CalendarConfig[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ calendars }) => {
  const combinedCalendarSrc = useMemo(() => {
    const validCalendars = calendars.filter(cal => cal.src && cal.src.includes('src='));
    
    if (validCalendars.length === 0) {
      return null;
    }

    const base = 'https://calendar.google.com/calendar/embed?';
    const params = validCalendars.map(cal => {
      try {
        const url = new URL(cal.src);
        const srcParam = url.searchParams.get('src');
        return srcParam ? `src=${encodeURIComponent(srcParam)}` : null;
      } catch (e) {
        return null;
      }
    }).filter((p): p is string => p !== null);
    
    // 一貫性のために固定のタイムゾーンを使用し、ライトテーマに合わせた背景色を指定
    return `${base}${params.join('&')}&ctz=Asia%2FTokyo&wkst=1&bgcolor=%23ffffff&color=%23ffffff`;

  }, [calendars]);

  return (
    <div className="bg-brand-secondary rounded-lg shadow-md flex flex-col h-full overflow-hidden border border-brand-accent">
      <div className="p-4 border-b border-brand-accent">
        <h2 className="text-xl font-bold text-brand-text">チームスケジュール</h2>
      </div>
      <div className="flex-grow p-4">
        {combinedCalendarSrc ? (
          <iframe
            src={combinedCalendarSrc}
            className="w-full h-full border-0 rounded-md"
            title="チームカレンダー"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-primary rounded-md">
            <p className="text-brand-subtle text-center">
              {calendars.length > 0 
                ? '表示するカレンダーがありません。\n設定でURLを確認してください。' 
                : '設定でカレンダーを追加してください。'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};