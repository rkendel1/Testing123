# Frequently Asked Questions (FAQ)

## General Questions

### What is this project?

This is a self-contained, ready-to-code development studio packaged in a Docker container. It includes VS Code Server (a browser-based IDE) with pre-installed extensions and common development tools.

### Who is this for?

- Developers who want a consistent development environment
- Teams who need standardized tooling
- Anyone who wants to code without installing tools locally
- Educators teaching programming
- People trying out different languages/frameworks

### What makes it "self-contained"?

Everything you need to start coding is included:
- Web-based IDE (VS Code Server)
- Popular programming languages (Node.js, Python)
- Common development tools and utilities
- Pre-installed VS Code extensions
- All dependencies are in the container

## Setup & Installation

### Do I need to install VS Code?

No! The IDE runs in your browser. You only need Docker installed.

### What are the system requirements?

- Docker (version 20.10+)
- 2GB+ RAM available for Docker
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 5GB+ free disk space

### How long does setup take?

- First build: 5-15 minutes (downloading and installing)
- Subsequent starts: 10-30 seconds

### Can I use this on Windows/Mac/Linux?

Yes! Docker works on all major platforms. The development environment will be identical regardless of your host OS.

## Usage Questions

### How do I access the IDE?

After starting the container, open your browser to `http://localhost:8080`. Default password is `developer`.

### Where do I put my code?

Put your code in the `workspace/` directory. This directory is mounted from your host machine, so files persist even if you stop the container.

### Can I install additional packages?

Yes! You have sudo access in the container:
```bash
sudo apt-get update
sudo apt-get install <package-name>
```

For Node.js: `npm install -g <package>`
For Python: `pip install <package>`

### How do I add more VS Code extensions?

Two ways:

1. **Temporarily** (current container only):
   - Use the Extensions panel in VS Code
   - Install like normal VS Code

2. **Permanently** (survives container rebuilds):
   - Edit the Dockerfile
   - Add: `RUN code-server --install-extension <extension-id>`
   - Rebuild the container

### Can I use Git inside the container?

Yes! Git is pre-installed. Configure it with:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### How do I stop the development studio?

```bash
docker-compose down
```

Your files in `workspace/` are preserved.

## Security Questions

### Is it secure to use the default password?

For local development, it's fine. For production or shared environments, you should change it:

1. Edit `docker-compose.yml`
2. Change the `PASSWORD` environment variable
3. Restart: `docker-compose down && docker-compose up -d`

### Can I use HTTPS?

Yes! You can configure code-server with SSL certificates. See the [code-server documentation](https://coder.com/docs/code-server/latest/guide#using-lets-encrypt-with-nginx) for details.

### Is my code private?

Yes. Everything runs locally on your machine. Nothing is uploaded to external servers unless you explicitly push to a git remote.

## Troubleshooting

### The container won't start

Check:
1. Is Docker running? `docker ps`
2. Is port 8080 available? `netstat -an | grep 8080`
3. Check logs: `docker-compose logs`

### I can't access localhost:8080

1. Verify container is running: `docker ps`
2. Check the port mapping in `docker-compose.yml`
3. Try `http://127.0.0.1:8080` instead
4. Check firewall settings

### Extensions aren't loading

Try:
```bash
docker-compose down -v  # Warning: removes extension volume
docker-compose build --no-cache
docker-compose up -d
```

### Performance is slow

1. Increase Docker resources (Settings → Resources)
2. Allocate more CPU/RAM to Docker
3. Check available disk space
4. Close unnecessary applications

### I lost my files!

Files in `workspace/` are safe - they're on your host machine. Check the `./workspace` directory in the repository folder.

### Changes to Dockerfile don't take effect

Rebuild the container:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Advanced Questions

### Can I run multiple instances?

Yes! Either:
1. Use different ports for each instance
2. Run in different directories

Example:
```yaml
ports:
  - "8081:8080"  # Use port 8081 instead
```

### Can I add database support?

Yes! Add a database service to `docker-compose.yml`:

```yaml
services:
  dev-studio:
    # existing config...
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
```

### Can I use this in CI/CD?

Yes! The container can be used as a build environment in CI/CD pipelines. Example with GitHub Actions:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: your-registry/dev-studio:latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
```

### How do I customize for my team?

1. Fork the repository
2. Modify Dockerfile with your tools/extensions
3. Share the repository with your team
4. Everyone gets the same environment

### Can I use this with GitHub Codespaces?

Yes! The `.devcontainer/devcontainer.json` configuration is included. Just open the repository in GitHub and create a Codespace.

### How do I backup my workspace?

The `workspace/` directory is on your host machine. Back it up like any other directory:
```bash
tar -czf backup.tar.gz workspace/
# or use git, rsync, cloud storage, etc.
```

### Can I add Docker-in-Docker?

Yes, but it requires additional configuration:

1. Mount Docker socket: `-v /var/run/docker.sock:/var/run/docker.sock`
2. Add Docker CLI to the container
3. Use with caution (security implications)

## Project-Specific Questions

### Can I use TypeScript?

Yes! TypeScript is pre-installed globally. Create a `tsconfig.json` and start coding.

### Can I use Python virtual environments?

Yes!
```bash
cd workspace
python3 -m venv myenv
source myenv/bin/activate
```

### What Node.js version is included?

The version from Ubuntu 22.04 repositories. To use a specific version, modify the Dockerfile to install from NodeSource.

### Can I add other languages (Go, Rust, Java)?

Yes! Edit the Dockerfile to install additional languages:

```dockerfile
# For Go
RUN wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# For Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

## Getting Help

### Where can I report issues?

Open an issue on the GitHub repository with:
- Description of the problem
- Steps to reproduce
- Error messages or logs
- Your environment (OS, Docker version)

### How can I contribute?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Where can I learn more about the tools?

- [VS Code documentation](https://code.visualstudio.com/docs)
- [Docker documentation](https://docs.docker.com/)
- [code-server documentation](https://coder.com/docs/code-server)
- [Node.js documentation](https://nodejs.org/docs)
- [Python documentation](https://docs.python.org/)

## Still Have Questions?

Feel free to:
- Open a GitHub issue
- Check the [README.md](README.md) for basic information
- Check the [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Check the [QUICKSTART.md](QUICKSTART.md) for quick commands
