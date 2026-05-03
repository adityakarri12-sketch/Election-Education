# Stage 1: Build the Next.js frontend
FROM node:20-slim AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the static files
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:3.11-slim AS backend-builder

# Set working directory
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt ./

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ ./

# Copy the built frontend from the previous stage
# The backend is configured to look in /app/static, static, ../frontend/out, etc.
# We'll put it in /app/static which is the first preference.
COPY --from=frontend-builder /app/frontend/out /app/static

# Expose the port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
