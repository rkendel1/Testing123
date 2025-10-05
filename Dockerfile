# AI Development Studio - Single Container with AI Router and Preview
FROM ubuntu:24.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Environment variables for AI configuration
ENV PASSWORD=developer
ENV DEFAULT_PROVIDER=ollama
ENV DEFAULT_MODEL=codellama

# Install essential development tools and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    vim \
    nano \
    sudo \
    openssl \
    net-tools \
    locales \
    dumb-init \
    htop \
    ca-certificates \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Set up locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
    chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
    apt-get update && \
    apt-get install -y gh && \
    rm -rf /var/lib/apt/lists/*

# Install Supabase CLI
RUN npm install -g supabase

# Install code-server (VS Code in the browser)
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Install Ollama for local AI models
RUN curl -fsSL https://ollama.com/install.sh | sh

# Create a non-root user for development
RUN useradd -m -s /bin/bash -G sudo developer && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set up workspace directory
RUN mkdir -p /workspace && chown -R developer:developer /workspace

# Copy AI Router source code
COPY --chown=developer:developer ai-router /home/developer/ai-router

# Copy Preview App source code
COPY --chown=developer:developer preview-app /home/developer/preview-app

# Copy VS Code extension
COPY --chown=developer:developer extensions/ai-coder /home/developer/extensions/ai-coder

# Copy configuration files
COPY --chown=developer:developer config/code-server/settings.json /home/developer/.local/share/code-server/User/settings.json

# Copy startup script
COPY --chown=developer:developer start.sh /home/developer/start.sh
RUN chmod +x /home/developer/start.sh

# Switch to developer user
USER developer
WORKDIR /workspace

# Create code-server config directory and settings directory
RUN mkdir -p /home/developer/.config/code-server && \
    mkdir -p /home/developer/.local/share/code-server/User

# Configure code-server with environment variable support
RUN echo "bind-addr: 0.0.0.0:8080" > /home/developer/.config/code-server/config.yaml && \
    echo "auth: password" >> /home/developer/.config/code-server/config.yaml && \
    echo "password: \${PASSWORD}" >> /home/developer/.config/code-server/config.yaml && \
    echo "cert: false" >> /home/developer/.config/code-server/config.yaml

# Install AI Router dependencies
RUN cd /home/developer/ai-router && npm install

# Install Preview App dependencies
RUN cd /home/developer/preview-app && npm install

# Install VS Code extension dependencies and build
RUN cd /home/developer/extensions/ai-coder && npm install

# Pre-install popular VS Code extensions
RUN code-server --install-extension ms-python.python && \
    code-server --install-extension dbaeumer.vscode-eslint && \
    code-server --install-extension esbenp.prettier-vscode && \
    code-server --install-extension eamodio.gitlens && \
    code-server --install-extension ms-vscode.vscode-typescript-next && \
    code-server --install-extension streetsidesoftware.code-spell-checker && \
    code-server --install-extension usernamehw.errorlens && \
    code-server --install-extension PKief.material-icon-theme

# Install AI Coder extension from local directory
RUN code-server --install-extension /home/developer/extensions/ai-coder || true

# Install popular development packages globally
RUN npm install -g typescript ts-node nodemon eslint prettier && \
    pip3 install --user black flake8 pylint autopep8

# Expose ports: 8080 (IDE), 3000 (AI Router), 5173 (Preview)
EXPOSE 8080 3000 5173

# Set entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start all services using the startup script
CMD ["/home/developer/start.sh"]
