import React, { useMemo } from 'react';
import { CalendarConfig } from '../types';

interface CalendarViewProps {
  calendars: CalendarConfig[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ calendars }) => {
  const combinedCalendarSrc = useMemo(
    () =>
      'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FTokyo&showTitle=0&showTz=0&src=MTVhNjgzZTdkZWQ3YjZiYTY5OWMxNGViYzI3YzdlZTcxYmUzNDY1MTYxYTI1MzYxNzU2OTI1YzIwMGM1ZDc4OUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MmE2ZTExMTNkMDcwMmJkN2Y3MWEzNDY3Y2Q2MmQ2NDIzYjhiOWIzMDVmMmRiNzQ5ZWQwNWQxZWIxY2ZkNTFjZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ODE0NGQzNjI3YmM5OWFhZDdiNThlOWVhM2ZmYjg3MjczNTQ1OTE0ZmRiNTcxYjlhZjc2YTc0Y2I4MGQxY2Q0NUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MDQzYTc5MDk2ZGViYjg1NzJmN2IyNmVkYzVjOTMyNGI1YmJjMGQxMTNjMjhhOTRiZjk5ZDBiMDczZDgwZmVkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=amEuamFwYW5lc2UjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230b8043&color=%23039be5&color=%23ef6c00&color=%23d50000&color=%238e24aa',
    []
  );

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
        <h2 className="text-xl font-bold text-brand-text">岩手県トラック協会予定ボード</h2>
        <span className="text-md font-medium text-brand-subtle">{todayString}</span>
      </div>
      <div className="flex-grow p-4 flex">
        {combinedCalendarSrc ? (
          <iframe
            src={combinedCalendarSrc}
            className="h-full"
            style={{ border: 'solid 1px #777', width: '800px' }}
            frameBorder={0}
            scrolling="no"
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
