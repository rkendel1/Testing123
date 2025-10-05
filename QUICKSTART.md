# Quick Reference Card

## 🚀 Getting Started (Choose One)

### Option 1: Docker Compose (Easiest)
```bash
docker-compose up -d
```
Access at: http://localhost:8080 (password: developer)

### Option 2: Docker CLI
```bash
docker build -t dev-studio .
docker run -d -p 8080:8080 -v $(pwd)/workspace:/workspace --name dev-studio dev-studio
```
Access at: http://localhost:8080 (password: developer)

### Option 3: GitHub Codespaces
1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for setup to complete
3. Start coding!

## 📦 What's Pre-installed

| Category | Tools |
|----------|-------|
| **Languages** | Node.js, Python 3 |
| **Version Control** | Git |
| **Editors** | VS Code Server, vim, nano |
| **JS/TS Tools** | TypeScript, ESLint, Prettier, nodemon, ts-node |
| **Python Tools** | black, flake8, pylint, autopep8 |

## 🎨 VS Code Extensions Included

- Python Support
- ESLint
- Prettier
- GitLens
- TypeScript Support
- Code Spell Checker
- Error Lens
- Material Icon Theme

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Stop container | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Restart container | `docker-compose restart` |
| Rebuild image | `docker-compose build --no-cache` |
| Access shell | `docker exec -it dev-studio bash` |

## 📂 File Locations

- **Your code**: `./workspace/` (persisted on host)
- **Extensions**: Stored in Docker volume `dev-studio-extensions`
- **Configuration**: `.devcontainer/devcontainer.json`

## 💡 Tips

- Press `Ctrl + \`` to open terminal in VS Code
- Press `F1` for command palette
- Press `Ctrl + P` for quick file search
- All files in `workspace/` are saved to your host machine

## 🆘 Troubleshooting

**Port already in use?**
```bash
docker-compose down
# Or change port in docker-compose.yml to 8081:8080
```

**Container won't start?**
```bash
docker-compose logs
```

**Reset everything?**
```bash
docker-compose down -v  # Warning: deletes extensions volume
docker-compose up -d
```

## 📚 More Information

See [README.md](README.md) for detailed documentation.
