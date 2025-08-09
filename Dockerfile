# BUILD STAGE - Frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Copy frontend build from build stage
COPY --from=frontend-build /app/frontend/build ./frontend/build