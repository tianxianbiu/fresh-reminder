# 鲜尝提醒 - 部署指南

## 项目概述

这是一个使用 React + TypeScript + Vite + Tailwind CSS 构建的食品保质期管理应用。

## 📁 项目文件结构

```
/workspace/
├── dist/                    # 已构建的生产版本（可直接部署）
├── android/                 # Android 原生项目
├── ios/                     # iOS 原生项目
├── src/                     # React 源代码
├── package.json
├── capacitor.config.ts
└── 其他配置文件
```

---

## 🌐 方案1：在线访问（推荐）

### 部署到 Vercel（免费）

1. 在本地电脑上克隆项目
2. 安装依赖：`pnpm install`
3. 安装 Vercel CLI：`npm i -g vercel`
4. 登录 Vercel：`vercel login`
5. 部署：`vercel`

部署完成后，你会获得一个永久链接，例如：`https://your-app.vercel.app`

---

## 📱 方案2：打包成手机 App

### Android App（.apk）

**前提条件：**
- Android Studio 已安装
- Android SDK 配置完成
- Gradle 已安装（Android Studio 通常自带）

**构建步骤：**

```bash
# 1. 进入 Android 项目目录
cd android

# 2. 构建 Debug 版本
./gradlew assembleDebug

# 3. APK 文件会生成在：
# android/app/build/outputs/apk/debug/app-debug.apk

# 4. 将 APK 文件传输到手机安装即可
```

**构建 Release 版本（需要签名）：**
```bash
./gradlew assembleRelease
```

---

### iOS App（.ipa）

**前提条件：**
- macOS 系统
- Xcode 已安装
- Apple Developer 账号（可选，用于真机测试）

**构建步骤：**

```bash
# 1. 进入 iOS 项目目录
cd ios

# 2. 使用 Xcode 打开项目
open App.xcworkspace

# 3. 在 Xcode 中：
#    - 选择目标设备或模拟器
#    - 点击运行（▶️）即可在模拟器中运行
#    - 或连接 iPhone 进行真机测试

# 4. 发布 App Store：
#    - 在 Xcode 中选择 Product → Archive
#    - 按照指引提交到 App Store
```

---

## 💻 方案3：本地开发预览

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm run dev

# 3. 浏览器访问 http://localhost:5173

# 4. 构建生产版本
pnpm run build

# 预览生产版本
pnpm run preview
```

---

## 📦 文件说明

- `dist/` - Web 生产版本，可直接部署到任何静态托管服务
- `android/` - Android 原生项目，使用 Android Studio 打开
- `ios/` - iOS 原生项目，使用 Xcode 打开

## 🔧 数据存储

所有数据保存在浏览器 localStorage 中，可以：
- 在设置页面导出数据为 JSON
- 定期备份数据以防丢失

## 📱 添加到手机桌面

部署到 Vercel 后：
1. 用手机浏览器打开你的网站
2. 点击浏览器菜单（⋮ 或 ···）
3. 选择"添加至主屏幕"或"添加到主屏"

这样就会像原生 App 一样出现在手机桌面上！

---

## ❓ 常见问题

**Q: Android 构建失败？**
A: 确保 Android Studio 和 SDK 已正确安装，检查 JAVA_HOME 环境变量

**Q: iOS 无法在真机上运行？**
A: 需要在 Apple Developer 官网注册设备，并配置签名证书

**Q: 如何更新 App？**
A: 修改代码后重新构建并部署即可，数据会自动保留在 localStorage 中

**Q: 数据会丢失吗？**
A: 数据保存在浏览器本地，建议定期在设置页面导出备份
