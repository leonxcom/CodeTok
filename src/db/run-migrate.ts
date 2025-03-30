// 运行数据库迁移的脚本
import { migrate } from './migrate';

// 执行迁移
migrate()
  .then(() => {
    console.log('迁移脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('迁移脚本执行失败:', error);
    process.exit(1);
  }); 