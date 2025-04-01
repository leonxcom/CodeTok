const fs = require('fs');
const path = require('path');

// 读取项目数据
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev_projects.json'), 'utf8'));

// 构建导入命令
const commands = projectsData.map(project => {
  return `curl -X POST https://vilivili.vercel.app/api/projects/external -H "Content-Type: application/json" -d '${JSON.stringify({
    url: project.external_url,
    title: project.title,
    description: project.description,
    author: project.external_author
  })}'`;
}).join(' && ');

// 将命令写入脚本文件
fs.writeFileSync(path.join(__dirname, 'import-commands.sh'), `#!/bin/bash\n${commands}\n`);
fs.chmodSync(path.join(__dirname, 'import-commands.sh'), '755'); 