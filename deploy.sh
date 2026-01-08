#!/bin/bash

# VitePress 项目部署脚本
# 使用方法: ./deploy.sh [服务器地址] [远程目录]

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署流程...${NC}"

# 检查是否已构建
if [ ! -d "docs/.vitepress/dist" ]; then
    echo -e "${YELLOW}未找到构建产物，开始构建...${NC}"
    npm install
    npm run docs:build
fi

# 如果提供了服务器参数，使用 rsync 上传
if [ -n "$1" ] && [ -n "$2" ]; then
    SERVER=$1
    REMOTE_DIR=$2
    
    echo -e "${GREEN}上传文件到服务器: ${SERVER}:${REMOTE_DIR}${NC}"
    rsync -avz --delete \
        docs/.vitepress/dist/ \
        ${SERVER}:${REMOTE_DIR}/
    
    echo -e "${GREEN}部署完成！${NC}"
else
    echo -e "${YELLOW}构建完成！构建产物在: docs/.vitepress/dist${NC}"
    echo -e "${YELLOW}使用方法: ./deploy.sh user@server.com /var/www/annual-report${NC}"
fi

