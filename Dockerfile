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
COPY . .
RUN npm run build

# Ensure build output exists before copying
RUN mkdir -p /usr/src/app/output-build && cp -r build /usr/src/app/output-build

################################################################################
# Final stage
FROM base as final

ENV NODE_ENV=production
USER node

# Copy dependencies
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/output-build ./output-build
COPY package.json .

# Expose port & run app
EXPOSE 5216
CMD ["npm", "start"]
