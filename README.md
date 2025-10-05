# Testing123 - Self-Contained Development Studio

A complete, ready-to-code development environment in a single Docker container. Everything you need is pre-installed and configured, including VS Code Server and popular extensions.

## 🚀 Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose (optional, but recommended)

### Using Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rkendel1/Testing123.git
   cd Testing123
   ```

2. **Build and run the container:**
   ```bash
   docker-compose up -d
   ```

3. **Access the IDE:**
   Open your browser and navigate to: `http://localhost:8080`
   
   Default password: `developer`

### Using Docker CLI

1. **Build the image:**
   ```bash
   docker build -t dev-studio .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 8080:8080 -v $(pwd)/workspace:/workspace --name dev-studio dev-studio
   ```

3. **Access the IDE:**
   Open your browser and navigate to: `http://localhost:8080`
   
   Default password: `developer`

## 📦 What's Included

### Development Tools
- **Git** - Version control
- **Node.js & npm** - JavaScript runtime and package manager
- **Python 3 & pip** - Python runtime and package manager
- **Build tools** - gcc, make, and other essential build utilities
- **Text editors** - vim, nano

### Pre-installed Development Packages
- **JavaScript/TypeScript:**
  - TypeScript
  - ts-node
  - nodemon
  - ESLint
  - Prettier

- **Python:**
  - black (formatter)
  - flake8 (linter)
  - pylint (linter)
  - autopep8 (formatter)

### VS Code Extensions (Pre-installed)
- Python support
- ESLint
- Prettier
- GitLens
- TypeScript support
- Code Spell Checker
- Error Lens
- Material Icon Theme

## 🔧 Configuration

### Changing the Password
Edit the `docker-compose.yml` file and change the `PASSWORD` environment variable, or modify the Dockerfile to set a different default password.

### Adding More Extensions
Extensions can be added by modifying the Dockerfile. Add lines like:
```dockerfile
RUN code-server --install-extension <extension-id>
```

### Custom Configuration
The workspace directory is mounted as a volume, so any files you create will persist on your host machine in the `workspace` directory.

## 🌐 GitHub Codespaces Support

This repository includes a `.devcontainer` configuration, making it compatible with GitHub Codespaces. Simply:

1. Click the "Code" button on GitHub
2. Select "Codespaces"
3. Create a new codespace

Your development environment will be ready in minutes!

## 📁 Directory Structure

```
.
├── Dockerfile              # Main container definition
├── docker-compose.yml      # Docker Compose configuration
├── .devcontainer/          # GitHub Codespaces configuration
│   └── devcontainer.json
├── start.sh               # Startup script
├── workspace/             # Your working directory (mounted volume)
└── README.md              # This file
```

## 🛠 Usage Tips

### Accessing the Terminal
Once you're in the web IDE, you can open a terminal by:
- Menu: Terminal → New Terminal
- Keyboard: Ctrl + ` (backtick)

### Installing Additional Tools
You can install additional tools using apt:
```bash
sudo apt-get update
sudo apt-get install <package-name>
```

### Stopping the Container
```bash
docker-compose down
```

Or if using Docker CLI:
```bash
docker stop dev-studio
```

### Viewing Logs
```bash
docker-compose logs -f
```

Or if using Docker CLI:
```bash
docker logs -f dev-studio
```

## 🤝 Contributing

Feel free to submit issues or pull requests to improve this development studio!

## 📄 License

This project is open source and available under the MIT License.