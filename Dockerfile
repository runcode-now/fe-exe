# syntax=docker/dockerfile:1

# Sử dụng Node.js để build ứng dụng React
ARG NODE_VERSION=20.15.1
FROM node:${NODE_VERSION}-alpine as build

WORKDIR /app

# Sao chép package.json và package-lock.json trước để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies, chỉ lấy dependencies cần thiết cho production
RUN npm ci --omit=dev

# Sao chép toàn bộ source code vào container
COPY . .

# Build ứng dụng React
RUN npm run build

################################################################################
# Dùng Nginx làm web server để chạy ứng dụng React
FROM nginx:alpine as final

# Copy file build từ bước trước sang thư mục Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh (nếu có)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80 để server có thể truy cập
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]

