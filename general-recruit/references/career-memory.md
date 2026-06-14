# 求职记忆工作流（通用版）

## 记忆文件

默认路径：`career-memory/general-recruit-memory.md`

## 可记录内容

| 字段 | 示例 | 用途 |
|------|------|------|
| 学历/专业/毕业时间 | "专升本 计算机 2027.06 毕业" | 判断可投校招/社招 |
| 目标岗位 | "运维实习、AI 技术支持" | 岗位推荐匹配 |
| 目标城市 | "苏州、无锡、深圳" | 城市筛选 |
| 技能栈 | "Linux/Docker/Python/MQTT/AWS" | JD 匹配 |
| 项目亮点 | "省 IoT 竞赛/ AWS 管道/ AI-Memory" | 简历+面试素材 |
| 招聘阶段 | "准备秋招、简历已完成" | 跟进节奏 |
| 辅导偏好 | "直接、不啰嗦、多讲实操" | 调整输出风格 |

## 禁止记录

- 身份证/手机号/住址
- 银行卡/支付信息
- 完整简历原文
- 完整聊天记录
- 薪酬数字/offer 档位
- 学校层级主观评价

## 操作命令

| 操作 | 说明 |
|------|------|
| 首次使用 | 运行 `python scripts/career_memory.py init` |
| 查看画像 | 运行 `python scripts/career_memory.py show` |
| 追加信息 | 运行 `python scripts/career_memory.py append --text "..."` |
| 清除记忆 | 运行 `python scripts/career_memory.py forget` |

## 使用原则

1. 只在用户主动提供长期相关信息时才写入
2. 每条记录写在一行，带时间戳
3. 定期问用户是否需要更新
4. 不写入与求职无关的个人信息
