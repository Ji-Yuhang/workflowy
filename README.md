# React 模仿 workflowy 和　国内的幕布
# 当前版本充满了大量的 Bug, 仅做部分演示


[测试链接 https://memorysheep.com/workflowy#/](https://memorysheep.com/workflowy#/)

![alt text](https://raw.githubusercontent.com/Ji-Yuhang/workflowy/master/docs/images/2019-06-03-22-38-34.jpg)

## workflowy
[workflowy](http://www.workflowy.com/)
## 幕布
[幕布网](https://mubu.com)


## TODO
- ~~节点为文字为空时再按删除键，删除当前节点~~
- ~~序列化和反序列化~~
- 使用 redux 随时保存文档状态到 LocalStroage
- ~~同步文档到服务器(需要后台 API)~~
  - model: { version: string, content: string, user_id: string}
  - get current version
  - post content and return new version
- #tag 标签搜索
- 导出 markdown, csv, text, mindmap...
