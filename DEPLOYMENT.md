# 部署指南

本指南介绍如何将 VitePress 年度总结报告项目部署到服务器。

## 前置准备

1. **本地构建测试**
   ```bash
   # 安装依赖
   npm install
   
   # 构建生产版本
   npm run docs:build
   
   # 本地预览构建结果
   npm run docs:preview
   ```

   构建完成后，静态文件将生成在 `docs/.vitepress/dist` 目录中。

2. **检查构建产物**
   ```bash
   ls -la docs/.vitepress/dist
   ```
   确保 `dist` 目录包含 `index.html` 及其他静态文件。

---

## 部署方式

### 方式一：使用 Nginx 部署（推荐）

适用于拥有自己的 Linux 服务器（如 Ubuntu、CentOS）。

#### 步骤 1：准备构建产物

在本地或服务器上构建项目：

```bash
# 在项目根目录执行
npm install
npm run docs:build
```

#### 步骤 2：上传文件到服务器

将 `docs/.vitepress/dist` 目录的所有文件上传到服务器，例如：

```bash
# 使用 scp 上传
scp -r docs/.vitepress/dist/* user@your-server:/var/www/annual-report/

# 或使用 rsync
rsync -avz docs/.vitepress/dist/ user@your-server:/var/www/annual-report/
```

#### 步骤 3：配置 Nginx

在服务器上编辑 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/annual-report
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名
    
    root /var/www/annual-report;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

#### 步骤 4：启用站点并重启 Nginx

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/annual-report /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 步骤 5：配置 SSL（可选但推荐）

使用 Let's Encrypt 配置 HTTPS：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### 方式二：使用 Node.js + Express 部署

适用于已经运行 Node.js 应用的服务器。

#### 步骤 1：创建简单的 Express 服务器

在项目根目录创建 `server.js`：

```javascript
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 提供静态文件服务
app.use(express.static(path.join(__dirname, 'docs/.vitepress/dist')));

// 所有路由都返回 index.html（支持 Vue Router）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/.vitepress/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

#### 步骤 2：更新 package.json

添加启动脚本：

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

#### 步骤 3：部署流程

```bash
# 在服务器上
git clone your-repo-url
cd annual-report
npm install
npm run docs:build
npm start
```

#### 步骤 4：使用 PM2 管理进程（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name annual-report

# 设置开机自启
pm2 startup
pm2 save
```

---

### 方式三：使用 GitHub Pages 部署（免费）

适用于需要免费托管且不要求自定义域名的场景。

#### 步骤 1：配置 VitePress

编辑 `docs/.vitepress/config.js`，添加 `base` 配置：

```javascript
export default defineConfig({
  base: '/your-repo-name/',  // 替换为你的 GitHub 仓库名
  title: '年度总结报告',
  // ... 其他配置
})
```

#### 步骤 2：创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 或 master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run docs:build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
```

#### 步骤 3：启用 GitHub Pages

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 选项
3. 选择 "Source" 为 "GitHub Actions"
4. 推送代码后，GitHub Actions 会自动部署

---

### 方式四：使用 Vercel 部署（免费，推荐用于快速部署）

#### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2：配置项目

在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "framework": null
}
```

#### 步骤 3：部署

```bash
vercel
```

按照提示操作即可。首次部署会要求登录和配置。

#### 步骤 4：后续更新

```bash
vercel --prod
```

或者直接在 Vercel 网站连接 GitHub 仓库，实现自动部署。

---

### 方式五：使用 Netlify 部署（免费）

#### 步骤 1：在 Netlify 网站创建新站点

1. 访问 [Netlify](https://www.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 连接你的 GitHub 仓库

#### 步骤 2：配置构建设置

- **Build command**: `npm run docs:build`
- **Publish directory**: `docs/.vitepress/dist`
- **Base directory**: 留空（或填写项目根目录）

#### 步骤 3：部署

点击 "Deploy site"，Netlify 会自动构建并部署。

---

## 部署检查清单

- [ ] 本地构建成功，无错误
- [ ] 本地预览正常，所有页面和资源可访问
- [ ] 静态文件已上传到服务器正确位置
- [ ] 服务器配置正确（Nginx/Node.js/托管平台）
- [ ] 域名解析正确（如使用自定义域名）
- [ ] SSL 证书配置正确（HTTPS）
- [ ] 测试所有页面链接和功能
- [ ] 测试移动端响应式布局
- [ ] 配置了自动部署（如使用 CI/CD）

---

## 常见问题

### 1. 页面刷新出现 404

**解决方案**：确保服务器配置了正确的路由回退到 `index.html`。

- Nginx: 使用 `try_files $uri $uri/ /index.html;`
- Express: 配置 `app.get('*', ...)` 路由

### 2. 资源路径错误

**解决方案**：检查 `base` 配置是否正确。

- 如果部署在子路径（如 `/annual-report/`），需要在 `config.js` 中设置 `base: '/annual-report/'`

### 3. 图片无法显示

**解决方案**：确保图片路径使用相对路径（以 `/` 开头），并在构建后检查图片文件是否在正确位置。

### 4. 构建失败

**解决方案**：
- 检查 Node.js 版本（VitePress 需要 Node.js 16+）
- 删除 `node_modules` 和 `package-lock.json`，重新安装依赖
- 检查是否有语法错误或缺少依赖

---

## 推荐部署方案

- **个人项目/测试**：GitHub Pages 或 Vercel（免费，简单）
- **生产环境**：Nginx + 自有服务器（性能好，完全控制）
- **团队协作**：Vercel 或 Netlify（自动部署，协作方便）

---

## 更新部署

更新内容后重新部署：

```bash
# 本地构建
npm run docs:build

# 重新上传文件（根据选择的部署方式）
# 或推送代码触发自动部署
git add .
git commit -m "更新内容"
git push
```

