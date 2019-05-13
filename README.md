# 1.安装node.js软件，版本>6

# 2.安装依赖
npm install

# 建议不要用 cnpm 安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 3.启动服务
npm run dev
```

浏览器访问 http://localhost:5566

## 4.发布 
# 构建测试环境
npm run build:sit

# 构建生产环境
npm run build
```

## 其它

```bash
# --report to build with bundle size analytics
npm run build

# --generate a bundle size analytics. default: bundle-report.html
npm run build --generate_report

# --preview to start a server in local to preview
npm run build --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
``` 
