import { sql } from '@vercel/postgres';

// データベース初期化
export async function initializeDatabase() {
  try {
    // employeesテーブルが存在しない場合のみ作成
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        return_time VARCHAR(10),
        destination VARCHAR(255)
      );
    `;

    // calendarsテーブルが存在しない場合のみ作成
    await sql`
      CREATE TABLE IF NOT EXISTS calendars (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        src TEXT
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// 初期データの挿入（テーブルが空の場合のみ）
export async function seedInitialData() {
  try {
    // employeesテーブルの初期データ
    const employeeResult = await sql`
      INSERT INTO employees (id, name, return_time, destination)
      VALUES
        ('1', 'Alice', '', ''),
        ('2', 'Bob', '14:00', 'Client Meeting'),
        ('3', 'Charlie', '', ''),
        ('4', 'Diana', '15:30', 'Lunch'),
        ('5', 'Ethan', '', ''),
        ('6', 'Fiona', '13:00', 'Supplier Visit')
      ON CONFLICT (id) DO NOTHING;
    `;

    // calendarsテーブルの初期データ
    const calendarResult = await sql`
      INSERT INTO calendars (id, name, src)
      VALUES
        ('1', '会社の祝日', 'https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo'),
        ('2', '営業チーム', '')
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('Initial data seeded successfully');
  } catch (error) {
    console.error('Initial data seeding error:', error);
    throw error;
  }
}

// 全データベース初期化
export async function setupDatabase() {
  await initializeDatabase();
  await seedInitialData();
}