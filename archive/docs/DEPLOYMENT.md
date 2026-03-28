# Deployment Guide & Troubleshooting

## 🚀 GitHub Pages Deployment (Master Branch)

**Important**: This repository uses GitHub Pages serving from the **master branch**, not gh-pages branch.

### 1. Before Deployment
```bash
# Check current branch
git branch
# Should be on master branch

# Check for uncommitted changes
git status
# Should be clean

# Verify latest commit
git log --oneline -n 3
```

### 2. Deploy Commands
```bash
# Standard deployment (recommended)
npm run deploy:check

# Force deployment (if needed)
npm run deploy

# Check deployment status
npm run deploy:status
```

### 3. How It Works
```
Source Code (master/src/)
    ↓
npm run build (creates build/ folder)
    ↓
Copy build files to master root
    ↓
Git commit and push to master
    ↓
GitHub Pages serves from master branch
    ↓
Live Website
```

### 4. File Structure After Deployment
```
master branch (after deployment):
├── src/                    # Source code
├── build/                  # Build folder (temporary)
├── index.html             # Deployed build file
├── static/                # Deployed build files
├── manifest.json
├── favicon.svg
└── README.md
```

### 5. Deployment Script Details
- **Build**: `npm run build` creates optimized files
- **Copy**: PowerShell copies build files to master root
- **Commit**: Git commits the build files
- **Push**: Git pushes to GitHub
- **Deploy**: GitHub Pages automatically serves from master

### 6. Troubleshooting

#### If deployment fails:
```bash
# Clean build and retry
git clean -fd
npm run build
npm run deploy
```

#### If files are outdated:
```bash
# Force fresh deployment
npm run deploy
```

#### If GitHub Pages shows old files:
```bash
# Check deployment status
npm run deploy:status
# Verify build files are in master root
dir | findstr /i "index.html static"
```

### 3. Verify Deployment
```bash
# Check gh-pages branch
git log --oneline -n 3 gh-pages

# Compare with master
git log --oneline -n 3 master
```

## 🔍 Troubleshooting Checklist

### Issue: Old files on live site
**Symptoms:**
- Latest changes not visible
- index.html shows old timestamp
- GitHub shows recent commit but site doesn't reflect it

**Solutions:**
1. **Force Deploy**: `npm run deploy` (includes --force flag)
2. **Check Branch**: Ensure you're on master branch
3. **Clear Cache**: Browser hard refresh + GitHub Pages cache
4. **Verify Build**: Check build folder has latest files

### Issue: Branch confusion
**Symptoms:**
- Multiple deployment branches
- Unclear which branch serves the site
- Inconsistent file versions

**Prevention:**
1. **Single Source**: Always deploy from master → gh-pages
2. **Consistent Process**: Use npm scripts, not manual commands
3. **Version Tracking**: Check console for version info
4. **Status Commands**: Use `npm run deploy:status`

## 📋 Best Practices

### Before Every Deploy
- [ ] On master branch
- [ ] Clean working directory
- [ ] Latest changes committed
- [ ] Build successful
- [ ] Version updated (if needed)

### After Every Deploy
- [ ] Check live site
- [ ] Verify version in console
- [ ] Test key features
- [ ] Clear browser cache

### Regular Maintenance
- [ ] Weekly deployment checks
- [ ] Monitor GitHub Pages status
- [ ] Update version numbers
- [ ] Clean up old branches

## 🚨 Emergency Commands

### Force Fresh Deployment
```bash
# Complete fresh deployment
git checkout master
git pull origin master
npm run build
npx gh-pages --dist build --dest . --dotfiles true --force --remove '["**/*"]'
```

### Sync Branches
```bash
# Sync master with gh-pages
git checkout master
git pull origin master
git checkout gh-pages
git merge master
git push origin gh-pages
git checkout master
```

## 📱 PWA Considerations

### Service Worker Updates
- Clear browser cache after deployment
- Test offline functionality
- Verify app install prompt
- Check manifest.json updates

### Mobile Testing
- Test on actual devices
- Check responsive design
- Verify PWA installation
- Test full-screen mode

---

**Last Updated**: 2026-03-02
**Version**: 2.1.1
