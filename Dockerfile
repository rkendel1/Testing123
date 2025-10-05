# Self-contained Development Studio
FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install essential development tools
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
    && rm -rf /var/lib/apt/lists/*

# Set up locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Install code-server (VS Code in the browser)
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Create a non-root user for development
RUN useradd -m -s /bin/bash -G sudo developer && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set up workspace directory
RUN mkdir -p /workspace && chown -R developer:developer /workspace

# Switch to developer user
USER developer
WORKDIR /workspace

# Create code-server config directory
RUN mkdir -p /home/developer/.config/code-server

# Configure code-server
RUN echo "bind-addr: 0.0.0.0:8080" > /home/developer/.config/code-server/config.yaml && \
    echo "auth: password" >> /home/developer/.config/code-server/config.yaml && \
    echo "password: developer" >> /home/developer/.config/code-server/config.yaml && \
    echo "cert: false" >> /home/developer/.config/code-server/config.yaml

# Pre-install popular VS Code extensions
RUN code-server --install-extension ms-python.python && \
    code-server --install-extension dbaeumer.vscode-eslint && \
    code-server --install-extension esbenp.prettier-vscode && \
    code-server --install-extension eamodio.gitlens && \
    code-server --install-extension ms-vscode.vscode-typescript-next && \
    code-server --install-extension streetsidesoftware.code-spell-checker && \
    code-server --install-extension usernamehw.errorlens && \
    code-server --install-extension PKief.material-icon-theme

# Install popular development packages globally
RUN npm install -g typescript ts-node nodemon eslint prettier && \
    pip3 install --user black flake8 pylint autopep8

# Expose code-server port
EXPOSE 8080

# Set entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start code-server
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "/workspace"]
