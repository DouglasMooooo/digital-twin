# 设置Upstash Redis用于Analytics

## 步骤1：创建Upstash Redis数据库

1. 访问 [Upstash Console](https://console.upstash.com/)
2. 使用你的GitHub账号登录（你已经有Upstash账号了）
3. 点击 **"Create Database"**
4. 配置：
   - **Name**: `digital-twin-analytics`
   - **Type**: **Regional** (免费)
   - **Region**: 选择离你最近的（如 `ap-southeast-2` 悉尼）
   - **Eviction**: 保持默认
5. 点击 **"Create"**

## 步骤2：获取Redis凭证

创建完成后，在数据库详情页：

1. 找到 **"REST API"** 标签
2. 复制两个值：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## 步骤3：配置环境变量

### 本地开发
编辑 `.env.local` 文件：

```bash
UPSTASH_REDIS_REST_URL=https://your-database-xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==
```

### Vercel部署
1. 访问你的Vercel项目
2. 进入 **Settings** → **Environment Variables**
3. 添加两个变量：
   - `UPSTASH_REDIS_REST_URL` = (从Upstash复制)
   - `UPSTASH_REDIS_REST_TOKEN` = (从Upstash复制)
4. 点击 **Save**
5. 重新部署项目

## 步骤4：测试

```bash
# 本地测试
npm run dev

# 1. 访问 http://localhost:3000
# 2. 使用AI聊天问几个问题
# 3. 访问 http://localhost:3000/admin/dashboard (密码: admin123)
# 4. 应该能看到实时analytics数据
```

## 验证Redis数据

在Upstash Console中：
1. 进入你的数据库
2. 点击 **"Data Browser"**
3. 查找key：`digital_twin:chat_logs`
4. 应该能看到JSON格式的聊天记录

## 免费额度

Upstash Redis免费版包括：
- ✅ 10,000 commands/day
- ✅ 256 MB storage
- ✅ Worldwide replicas

对于个人作品集项目完全够用！

## 故障排除

### 问题：仪表板显示"No Analytics Data Yet"
- 检查环境变量是否正确设置
- 检查Vercel日志是否有Redis错误
- 在Upstash Console查看数据库是否有数据

### 问题：Redis连接失败
- 确认URL和Token正确复制（没有空格）
- 确认数据库状态为Active
- 检查网络防火墙是否阻止Upstash域名
