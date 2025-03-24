FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install SQLite3 dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10.4.0

# Set pnpm home and add to path
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

# Set working directory
WORKDIR /workspaces/app

# We'll let the postCreateCommand in devcontainer.json handle the installation
# of dependencies when the container is created
