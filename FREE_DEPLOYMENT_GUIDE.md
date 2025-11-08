# 免费部署指南 - Douglas Mo Digital Twin

**适合小项目：算力需求不大，追求零成本部署**

---

## 🎯 为什么这个项目适合免费部署？

### 项目特点分析
- ✅ **轻量级应用**：主要是文本处理，无需大量计算资源
- ✅ **API驱动**：核心功能依赖外部API（Groq, Upstash），非CPU密集型
- ✅ **低流量预期**：个人项目，预计日访问量不高
- ✅ **静态资源少**：主要是API调用，无需大量存储

### 免费方案适用性
- ✅ **Vercel Hobby**：每月100GB流量，足够个人使用
- ✅ **Railway**：512MB RAM，适合轻量级Next.js应用
- ✅ **Render**：每月750小时运行时间，适合低频访问

---

## 🚀 推荐方案：Vercel Hobby (最简单)

### 为什么选择Vercel？
- **零配置**：自动检测Next.js项目
- **全球CDN**：快速响应
- **自动HTTPS**：免费SSL证书
- **GitHub集成**：推送自动部署

### 部署步骤

#### 1. 注册Vercel账户
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录（会打开浏览器）
vercel login
```

#### 2. 部署项目
```bash
# 在项目根目录
cd "d:\上课\Ai agent\digital twin"

# 部署到生产环境
vercel --prod
```

#### 3. 配置环境变量
在Vercel控制台设置以下环境变量：

```bash
# 必需的环境变量
UPSTASH_VECTOR_REST_URL=your_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_vector_token
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
GROQ_API_KEY=your_groq_api_key
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_32_chars
SESSION_SECRET=your_session_secret_32_chars
```

#### 4. 验证部署
```bash
# 检查网站是否正常
curl https://your-app.vercel.app/api/health

# 访问网站
# https://your-app.vercel.app
```

### Vercel Hobby限制
- ✅ **每月100GB流量**：足够个人项目使用
- ✅ **每月100GB函数运行时间**：绰绰有余
- ✅ **每月10万个函数调用**：足够处理API请求
- ⚠️ **不支持自定义域名**（可升级到Pro获取）

---

## 🛤️ 备选方案：Railway (更灵活)

### Railway优势
- **免费层**：512MB RAM，$5/GB额外流量
- **数据库支持**：可直接托管PostgreSQL/Redis
- **Docker支持**：可使用自定义Dockerfile

### 部署步骤

#### 1. 注册Railway账户
访问 <https://railway.app> 注册账户

#### 2. 连接GitHub仓库
```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 连接项目
railway link

# 部署
railway up
```

#### 3. 配置环境变量
在Railway控制台设置环境变量（同上）

#### 4. 验证部署
Railway会自动分配域名，格式如：`your-app.up.railway.app`

---

## 🐙 备选方案：Render (最稳定)

### Render优势
- **免费层**：每月750小时运行时间
- **自动SSL**：免费HTTPS
- **静态站点优化**：适合Next.js

### 部署步骤

#### 1. 注册Render账户
访问 <https://render.com> 注册

#### 2. 连接GitHub仓库
- 在Render控制台创建新Web Service
- 连接GitHub仓库
- 选择 `d:\上课\Ai agent\digital twin` 项目

#### 3. 配置构建设置
```
Build Command: npm run build
Start Command: npm start
Node Version: 18
```

#### 4. 配置环境变量
添加所有必需的环境变量

#### 5. 部署
Render会自动构建和部署，分配免费域名

---

## 💰 成本对比

| 方案 | 月成本 | 限制 | 推荐指数 |
|------|--------|------|----------|
| **Vercel Hobby** | $0 | 100GB流量 | ⭐⭐⭐⭐⭐ |
| **Railway** | $0 | 512MB RAM | ⭐⭐⭐⭐ |
| **Render** | $0 | 750小时 | ⭐⭐⭐⭐ |
| **Vercel Pro** | $20 | 无限制 | ⭐⭐⭐ (如果需要自定义域名) |
| **DigitalOcean** | $12 | 1GB RAM | ⭐⭐⭐ |
| **AWS Lightsail** | $10 | 1GB RAM | ⭐⭐ |

---

## ⚙️ 环境变量配置

### 必需变量（所有方案都需要）

```bash
# Upstash Vector Database (语义搜索)
UPSTASH_VECTOR_REST_URL=https://your-vector-db.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_vector_token

# Upstash Redis (缓存和分析)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Groq AI API (LLM服务)
GROQ_API_KEY=your_groq_api_key

# 安全配置
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_32_character_jwt_secret
SESSION_SECRET=your_32_character_session_secret
```

### 可选变量（生产环境建议设置）

```bash
# 生产环境标识
NODE_ENV=production

# 日志级别
LOG_LEVEL=info

# 缓存配置
CACHE_TTL=3600

# 分析配置
ANALYTICS_ENABLED=true
```

---

## 🔧 免费数据库服务

### Upstash (推荐)
- **Vector Database**: 免费层每月10万次查询
- **Redis**: 免费层每月10万次命令
- **地址**: <https://upstash.com>

### 替代方案
- **Redis Cloud**: 免费30MB Redis
- **MongoDB Atlas**: 免费512MB数据库
- **Supabase**: 免费PostgreSQL

---

## 📊 性能优化（免费方案）

### 1. 启用缓存
项目已内置Redis缓存，减少API调用

### 2. 优化构建
```json
// next.config.js 已优化
{
  "output": "standalone",
  "experimental": {
    "outputFileTracingRoot": undefined
  }
}
```

### 3. 压缩资源
Next.js自动启用Gzip压缩

### 4. CDN加速
Vercel/Railway自动提供全球CDN

---

## 🚨 免费方案限制及应对

### Vercel Hobby限制
| 限制 | 影响 | 应对方案 |
|------|------|----------|
| 每月100GB流量 | 高流量时可能超限 | 升级到Pro或使用Railway |
| 无自定义域名 | 域名是随机分配 | Vercel Pro可使用自定义域名 |
| 函数超时10秒 | 复杂查询可能超时 | 已优化响应时间在2秒内 |

### Railway限制
| 限制 | 影响 | 应对方案 |
|------|------|----------|
| 512MB RAM | 内存密集操作受限 | 项目内存使用仅150MB，绰绰有余 |
| $5/GB额外流量 | 超出免费流量收费 | 控制月流量在免费范围内 |

### Render限制
| 限制 | 影响 | 应对方案 |
|------|------|----------|
| 每月750小时 | 24/7运行会超限 | 适合低频访问的项目 |
| 冷启动时间 | 首次访问稍慢 | 已优化启动时间在30秒内 |

---

## 🧪 测试部署

### 健康检查
```bash
# 检查API健康状态
curl https://your-app.vercel.app/api/health
```

### 功能测试
```bash
# 测试基本功能
curl "https://your-app.vercel.app/api/chat?message=hello"
```

### 性能测试
```bash
# 简单负载测试
for i in {1..10}; do
  curl -s "https://your-app.vercel.app/api/health" &
done
```

---

## 🔄 升级路径

### 当免费方案不够用时

#### 升级到Vercel Pro ($20/月)
- 无限流量
- 自定义域名
- 高级分析
- 优先支持

#### 升级到Railway付费 ($10/月)
- 8GB RAM
- 100GB存储
- 私有网络

#### 自托管方案 ($10-20/月)
- DigitalOcean Droplet
- AWS Lightsail
- Linode VPS

---

## 📞 支持与故障排除

### 常见问题

**Q: 部署失败怎么办？**
A: 检查环境变量是否正确设置，确认所有必需的API密钥已配置

**Q: 网站访问慢怎么办？**
A: 免费方案可能有冷启动，首次访问稍慢是正常的

**Q: 超出免费额度怎么办？**
A: 监控使用情况，必要时升级到付费方案

**Q: 如何备份数据？**
A: Upstash提供自动备份，项目数据存储在Redis中

### 获取帮助
- **Vercel**: <https://vercel.com/docs>
- **Railway**: <https://docs.railway.app>
- **Render**: <https://docs.render.com>
- **项目文档**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## ✅ 总结

**对于小项目，这个系统完全可以零成本运行！**

### 推荐配置
- **部署平台**: Vercel Hobby (最简单)
- **数据库**: Upstash (免费层足够)
- **AI服务**: Groq (免费层足够)
- **月成本**: $0

### 扩展性
- 当前配置可支持每月数千次查询
- 如需更高负载，可无缝升级到付费方案
- 所有配置都支持水平扩展

### 实际使用建议
- 从Vercel Hobby开始（最简单）
- 如果需要更多控制，使用Railway
- 监控使用情况，适时升级

---

**🎉 现在就开始免费部署吧！**

**快速开始**:
1. 注册Vercel账户
2. 运行 `vercel --prod`
3. 配置环境变量
4. 访问你的免费网站！

---

**文档版本**: 1.0  
**更新日期**: 2025年11月8日  
**适用项目**: 小型个人项目，低算力需求
