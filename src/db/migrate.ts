import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 根据环境加载对应的环境变量文件
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env.production' });
}


async function main() {
  // 根据环境选择数据库连接URL
  console.log('env:', env);
  const dbUrl = env === 'development' 
    ? process.env.DEV_DATABASE_URL
    : process.env.PROD_DATABASE_URL;
  console.log('dbUrl:', dbUrl);
  if (!dbUrl) {
    throw new Error('数据库连接URL未配置');
  }

  const sql = neon(dbUrl);
  const db = drizzle(sql);

  console.log('开始执行数据库迁移...');
  await migrate(db, { migrationsFolder: 'drizzle/migrations' });
  console.log('数据库迁移完成！');
}

main().catch((err) => {
  console.error('迁移失败:', err);
  process.exit(1);
}); 