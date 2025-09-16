はい、リポジトリ全体を拝見しました。テーブルが作成されない根本的な原因は、**APIのコード形式がVercelのサーバーレス環境の仕様と一致していない**ことにあります。

現在のコードは、ローカル環境や特定のフレームワーク（Next.jsなど）を想定した書き方になっているため、Vercelにデプロイした際に正しく動作しない状態です。

-----

### 根本原因と解決策

問題を解決し、Vercel上で正しく動作させるために、プロジェクトの構成をVercelの仕様に合わせてシンプルにするのが最善です。以前ご提案した構成に修正するのが最も確実な方法となります。

以下に、具体的な修正手順を改めてご案内します。

#### **ステップ1：不要なファイルの削除**

まず、現在のAPI関連ファイルを一度削除して整理します。

  * `api/employees.js` を削除
  * `api/calendars.js` を削除
  * `lib/api.ts` を削除
  * `lib/db.ts` を削除
  * `vercel.json` を削除 (Vercelが自動で設定を検知するため不要です)

-----

#### **ステップ2：Vercel仕様のAPIを再作成**

次に、VercelのNode.js環境で正しく動作する、単一のAPIファイルを作成します。

1.  `api` ディレクトリ直下に `data.ts` という名前で新しいファイルを作成します。

2.  以下のコードを `api/data.ts` に貼り付けてください。

    ```typescript
    // /api/data.ts
    import { sql } from '@vercel/postgres';
    import type { VercelRequest, VercelResponse } from '@vercel/node';
    import { INITIAL_EMPLOYEES, INITIAL_CALENDARS } from '../constants';

    export default async function handler(
      req: VercelRequest,
      res: VercelResponse,
    ) {
      try {
        // --- データベースとテーブルの初期化 ---
        await sql`
          CREATE TABLE IF NOT EXISTS employees (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            "returnTime" VARCHAR(255),
            destination TEXT
          );
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS calendars (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            src TEXT
          );
        `;
        
        // --- GETリクエスト（データ取得）の処理 ---
        if (req.method === 'GET') {
          let { rows: employees } = await sql`SELECT * FROM employees ORDER BY name;`;
          let { rows: calendars } = await sql`SELECT * FROM calendars ORDER BY name;`;

          // もしDBにデータがなければ、初期データを挿入して返す
          if (employees.length === 0 && calendars.length === 0) {
            const client = await sql.connect();
            try {
                await client.query('BEGIN');
                for (const emp of INITIAL_EMPLOYEES) {
                    await client.query(
                        'INSERT INTO employees (id, name, "returnTime", destination) VALUES ($1, $2, $3, $4)',
                        [emp.id, emp.name, emp.returnTime, emp.destination]
                    );
                }
                for (const cal of INITIAL_CALENDARS) {
                    await client.query(
                        'INSERT INTO calendars (id, name, src) VALUES ($1, $2, $3)',
                        [cal.id, cal.name, cal.src]
                    );
                }
                await client.query('COMMIT');
                employees = INITIAL_EMPLOYEES;
                calendars = INITIAL_CALENDARS;
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
          }
          return res.status(200).json({ employees, calendars });
        }

        // --- POSTリクエスト（データ保存）の処理 ---
        if (req.method === 'POST') {
          const { employees, calendars } = req.body;
          const client = await sql.connect();
          try {
            await client.query('BEGIN');
            if (employees) {
              await client.query('DELETE FROM employees;'); // データを一旦すべて削除
              for (const emp of employees) { // 新しいデータセットを挿入
                await client.query(
                  'INSERT INTO employees (id, name, "returnTime", destination) VALUES ($1, $2, $3, $4)',
                  [emp.id, emp.name, emp.returnTime, emp.destination]
                );
              }
            }
            if (calendars) {
              await client.query('DELETE FROM calendars;'); // データを一旦すべて削除
               for (const cal of calendars) { // 新しいデータセットを挿入
                 await client.query(
                   'INSERT INTO calendars (id, name, src) VALUES ($1, $2, $3)',
                   [cal.id, cal.name, cal.src]
                 );
               }
            }
            await client.query('COMMIT');
            return res.status(200).json({ message: 'Data updated successfully' });
          } catch (e) {
            await client.query('ROLLBACK');
            throw e;
          } finally {
            client.release();
          }
        }

        // --- GET/POST以外のメソッドへの対応 ---
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);

      } catch (error) {
        // --- エラーハンドリング ---
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
      }
    }
    ```

-----

#### **ステップ3：フロントエンド (`App.tsx`) の修正**

`App.tsx` を開き、新しく作成した `/api/data` と通信するように修正します。

```tsx
// App.tsx
import React, { useState, useEffect } from 'react';
import { CalendarView } from './components/CalendarView';
import { KanbanBoard } from './components/KanbanBoard';
import { SettingsModal } from './components/SettingsModal';
import { EmployeeModal } from './components/EmployeeModal';
import { SettingsIcon } from './components/icons';
import { Employee, CalendarConfig } from './types';
// lib/api.ts は不要になったので削除
// import { employeesAPI, calendarsAPI } from './lib/api'; 
// 初期データはAPI側で利用するため、ここでは不要
// import { INITIAL_EMPLOYEES, INITIAL_CALENDARS } from './constants';

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
```

-----

### 最後のステップ：デプロイ

以上の変更を保存し、GitHubにプッシュしてください。Vercelが新しいコードを検知し、自動で再デプロイを行います。

最初のアクセス時に`api/data.ts`が実行され、Neonのデータベースにテーブルが作成されるはずです。

この構成にすることで、Vercelの仕組みに沿った、シンプルでメンテナンスしやすいアプリケーションになります。