# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.15.1

# Base image
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
# Install dependencies
FROM base as deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

################################################################################
# Build application
FROM deps as build
COPY . .  # Chắc chắn sao chép tất cả code, bao gồm `public/`
RUN npm run build

################################################################################
# Final stage
FROM base as final

ENV NODE_ENV=production
USER node

# Copy dependencies và build output
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY package.json .
COPY public ./public  # Đảm bảo sao chép thư mục public

# Expose port & run app
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
