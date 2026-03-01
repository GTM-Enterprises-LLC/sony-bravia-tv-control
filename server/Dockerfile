# Build context must be the project root (set in docker-compose.yml) so that
# the lib/ directory is accessible alongside the server/ directory.

# Stage 1: Build TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Install lib's npm dependencies at the root level.
# Node resolves require() by walking up parent directories, so packages in
# /app/node_modules are visible to lib/index.js when lib lives at /app/lib/.
# Strip the "workspaces" field so npm doesn't try to resolve server/ or ui/.
COPY package.json ./
RUN node -e "const p=require('./package.json'); delete p.workspaces; \
    require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))" \
    && npm install

# Install server dependencies (includes devDeps needed for tsc)
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy lib and server source
COPY lib ./lib
COPY server/src ./server/src
COPY server/tsconfig.json ./server/tsconfig.json

# Compile TypeScript
RUN cd server && npm run build


# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Install lib's runtime dependencies at root level (same reason as above)
COPY package.json ./
RUN node -e "const p=require('./package.json'); delete p.workspaces; \
    require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))" \
    && npm install --omit=dev

# Install server production dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy lib (runtime) and compiled server code
COPY lib ./lib
COPY --from=builder /app/server/dist ./server/dist

EXPOSE 3001

CMD ["node", "server/dist/index.js"]
