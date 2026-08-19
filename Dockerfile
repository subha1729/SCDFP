# Use Node.js LTS with Python runtime support
FROM node:20-bookworm-slim

# Install Python 3, pip, and required system tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy root and server package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install Node dependencies for root and server
RUN npm install
RUN cd server && npm install

# Install Python dependencies in a virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir \
    numpy \
    pandas \
    scikit-learn \
    scipy \
    joblib

# Copy application source code
COPY . .

# Build React production bundle
RUN npm run build

# Train default ML models
RUN python3 python_ml/train_default_models.py

# Expose backend API port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV PYTHON_BIN=python3

# Run Express server
CMD ["node", "server/server.js"]
