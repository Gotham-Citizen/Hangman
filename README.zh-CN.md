# 汇编：终局（Assembly: Endgame）

[English](README.md) | 简体中文

一个使用 React + Vite 构建的猜单词（刽子手）小游戏。在 8 种编程语言芯片被全部淘汰之前猜出单词，保护编程世界免受汇编语言的侵害！

[![Demo](./media/demo.gif)](./media/demo-video.mp4)

## 在线演示

<a href="https://gotham-citizen.github.io/Hangman/">
  <img src="./media/demo.png" alt="Hangman Screenshot" width="600">
</a>

点击上方图片或 [这里](https://gotham-citizen.github.io/Hangman/) 试试看！

## 功能特性

- 🎮 经典刽子手玩法，屏幕键盘交互
- ⌨️ 支持实体键盘——直接按 A–Z 即可猜字母，屏幕键盘同步显示
- 🗑️ 8 种编程语言以"芯片"形式展示——每猜错一次就会有一种语言带着告别语离你而去，`Assembly` 是最终的 Boss
- 📈 4 个难度等级（容易 / 中等 / 困难 / 专家）——难度越高单词越长（5 → 6 → 7 → 8-9 个字母）
- 💡 提示系统——猜不出时展示单词所属类别（动物、食物、身体部位、动作等）
- 🏆 连胜解锁机制——连续赢得 3 局即可解锁下一难度
- 🥇 最佳连胜记录——最长连胜会被记住，并在当局结束时展示
- 💾 完整进度保存到 `localStorage`——难度、当前单词、已猜字母、连胜数与最佳连胜都会在不同会话之间保留
- 🎉 胜利/失败时的彩带动画效果（react-confetti）
- ♿ 无障碍支持——屏幕阅读器实时播报、本地化 `<html lang>`、弹窗焦点锁定与可见的焦点样式
- 📱 全面响应式布局——从手机到桌面自动适配屏幕尺寸
- 🌐 界面支持多语言（英语 / 简体中文 / 西班牙语），根据浏览器语言自动选择（基于 react-i18next）

## 技术栈

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [react-i18next](https://react.i18next.com) — 国际化
- [clsx](https://github.com/lukeed/clsx) — 条件类名拼接
- [react-confetti](https://github.com/alampros/react-confetti) — 庆祝动画

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行 ESLint 检查
npm run lint
```

## 项目结构

```
components/
├── Chip.jsx                 # 编程语言芯片组件
├── DifficultySelector.jsx   # 难度等级按钮
├── GameStatus.jsx           # 胜利/失败/告别状态提示
├── Keyboard.jsx             # 屏幕键盘
├── LevelUpModal.jsx         # 升级确认弹窗
├── WinProgressModal.jsx     # 连胜进度提示弹窗
└── WordDisplay.jsx          # 隐藏单词的字母格子
src/
├── App.jsx                  # 主游戏组件（状态 + 逻辑）
├── constants.js             # 共享常量（难度顺序、字母表、连胜阈值）
├── languages.js             # 语言芯片数据
├── words.js                 # 带类别的单词库
├── utils.js                 # 难度 → 单词长度映射与随机选词
├── storage.js               # localStorage 读写辅助
├── index.jsx                # 应用入口
├── index.css                # 全局样式
├── hooks/
│   └── useWindowSize.js     # 响应式窗口尺寸 Hook
└── utils/
    ├── i18n.js              # i18next 配置
    └── locales/
        ├── en/translation.js  # 英语翻译
        ├── es/translation.js  # 西班牙语翻译
        └── zh/translation.js  # 中文翻译
```

## 游戏玩法

1. 每轮游戏根据当前难度从 `src/words.js` 中随机抽取单词（容易：5 个字母；中等：6 个；困难：7 个；专家：8-9 个）。
2. 玩家通过屏幕键盘或实体键盘（A–Z）猜测字母。
3. 猜对的字母会在单词中显示；猜错则会有一种编程语言芯片带着告别语被“淘汰”。
4. 当 8 个芯片全部淘汰时游戏失败（Assembly 作为 Boss 留到最后）；当单词中的所有字母都被猜出时游戏获胜。
5. 获胜后连胜数会增加——连续赢得 3 局即可解锁下一难度。
6. 最佳连胜会被记录，并在当局结束时显示在顶部。
7. 卡住了？点击“提示”按钮即可查看单词所属类别。