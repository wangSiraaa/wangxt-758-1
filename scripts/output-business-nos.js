import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '..', 'seed-758.json');

try {
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  
  console.log('=== 废旧家电回收估价 - 业务编号清单 ===\n');
  
  if (data.estimations && data.estimations.length > 0) {
    console.log(`共 ${data.estimations.length} 条估价记录：\n`);
    data.estimations.forEach((est, index) => {
      const category = data.categories?.find(c => c.id === est.categoryId);
      console.log(`${index + 1}. 业务编号: ${est.businessNo}`);
      console.log(`   品类: ${category?.name || '未知'}`);
      console.log(`   成色: ${est.conditionLevel || '-'}`);
      console.log(`   估价: ¥${est.estimatedPrice || 0}`);
      console.log(`   客户: ${est.residentName}`);
      console.log(`   电话: ${est.phone}`);
      if (est.address) console.log(`   地址: ${est.address}`);
      if (est.appointmentDate) console.log(`   预约: ${est.appointmentDate}`);
      console.log('');
    });
  } else {
    console.log('暂无估价记录');
  }
  
  console.log('\n=== 业务编号列表 ===');
  data.estimations?.forEach(est => console.log(est.businessNo));
  
} catch (error) {
  console.error('读取 seed-758.json 失败:', error.message);
  process.exit(1);
}
