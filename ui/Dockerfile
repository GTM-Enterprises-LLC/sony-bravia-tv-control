# Stage 1: Build Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Use a relative URL so Nginx on the same host can proxy /api to the backend.
# Override at build time with: docker build --build-arg VITE_API_URL=...
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

RUN npm run build

# Stage 2: Nginx serves the static files
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
