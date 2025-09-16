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
    
    // 注: Googleカレンダーの埋め込みURLパラメータでは、土曜日を青、日曜日を赤のように
    // 曜日の背景色を個別にカスタマイズする機能はサポートされていません。
    // スタイルはGoogleによって制御されます。日本の祝日カレンダーはデフォルトの色で祝日を表示します。
    return `${base}${params.join('&')}&ctz=Asia%2FTokyo&wkst=1&bgcolor=%23ffffff&color=%23ffffff`;

  }, [calendars]);

  const todayString = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const day = today.getDay();
    const week = ['日', '月', '火', '水', '木', '金', '土'];
    return `${year}年${month}月${date}日 (${week[day]})`;
  }, []);

  return (
    <div className="bg-brand-secondary rounded-lg shadow-md flex flex-col h-full overflow-hidden border border-brand-accent">
      <div className="p-4 border-b border-brand-accent flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-text">チームスケジュール</h2>
        <span className="text-md font-medium text-brand-subtle">{todayString}</span>
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
