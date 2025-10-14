# 🌊 Git Flow Guide for Car Rental Platform

## 📋 **Table of Contents**
1. [Branching Strategy](#branching-strategy)
2. [Branch Naming Conventions](#branch-naming-conventions)
3. [Workflow for Features](#workflow-for-features)
4. [Project-Specific Workflows](#project-specific-workflows)
5. [Release Management](#release-management)
6. [Quick Commands](#quick-commands)

---

## 🌳 **Branching Strategy**

### **Main Branches:**
- **`master`** - Production-ready code (stable releases)
- **`develop`** - Integration branch for features (next release)
- **`staging`** - Pre-production testing environment

### **Supporting Branches:**
- **`feature/*`** - New features and enhancements
- **`bugfix/*`** - Bug fixes for develop branch
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation and stabilization

---

## 🏷️ **Branch Naming Conventions**

### **Format: `type/scope-description`**

#### **Feature Branches:**
```bash
# Frontend features
feature/admin-user-management
feature/flutter-vehicle-search
feature/admin-booking-dashboard

# Backend features  
feature/api-authentication-jwt
feature/vehicle-service-search
feature/notification-service-sms

# Full-stack features
feature/booking-flow-integration
feature/payment-processing
feature/user-profile-management
```

#### **Bug Fix Branches:**
```bash
bugfix/flutter-login-crash
bugfix/api-cors-headers
bugfix/admin-table-pagination
```

#### **Hotfix Branches:**
```bash
hotfix/critical-payment-error
hotfix/security-vulnerability
hotfix/database-connection-leak
```

#### **Release Branches:**
```bash
release/v1.0.0
release/v1.1.0-beta
release/v2.0.0-rc1
```

---

## 🔄 **Workflow for Features**

### **Step 1: Create Feature Branch**
```bash
# Start from latest develop
git checkout develop
git pull origin develop

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Push branch to remote
git push -u origin feature/your-feature-name
```

### **Step 2: Development Process**
```bash
# Make your changes
git add .
git commit -m "feat(scope): add feature description

- Detailed description of changes
- What was implemented
- Any breaking changes
- Related issue: #123"

# Push regularly
git push origin feature/your-feature-name
```

### **Step 3: Keep Branch Updated**
```bash
# Regularly sync with develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git rebase develop

# Or use merge if preferred
git merge develop
```

### **Step 4: Complete Feature**
```bash
# Final push
git push origin feature/your-feature-name

# Create Pull Request to develop
# After approval and merge, cleanup
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 🚀 **Project-Specific Workflows**

### **Flutter Mobile App (`car_rental_app/`)**
```bash
# Feature development
git checkout -b feature/flutter-booking-ui

# Test before committing
cd car_rental_app
flutter analyze
flutter test
flutter build web --release

# Commit with specific scope
git commit -m "feat(flutter): implement booking confirmation UI

- Add BookingConfirmationPage with stepper
- Integrate with booking API
- Add payment method selection
- Update routing configuration"
```

### **Go Backend Services (`backend/`)**
```bash
# Service-specific feature
git checkout -b feature/api-vehicle-search-filters

# Test before committing
cd backend
make test-vehicle-service
make lint
docker-compose up -d  # Integration test

# Commit with service scope
git commit -m "feat(vehicle-service): add advanced search filters

- Add filter by price range, location radius
- Implement pagination for search results
- Add sorting by price, distance, rating
- Update API documentation"
```

### **Admin Frontend (`admin-frontend/`)**
```bash
# Admin feature development
git checkout -b feature/admin-analytics-dashboard

# Test before committing
cd admin-frontend
npm run lint
npm run type-check
npm run test
npm run build

# Commit with admin scope
git commit -m "feat(admin): add analytics dashboard

- Implement booking statistics charts
- Add revenue tracking components
- Create user activity monitoring
- Integrate with backend analytics API"
```

---

## 📦 **Release Management**

### **Preparing a Release**
```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Update version numbers
# Update CHANGELOG.md
# Final testing and bug fixes

# Merge to master and develop
git checkout master
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

git checkout develop  
git merge --no-ff release/v1.2.0

# Push everything
git push origin master develop --tags
git branch -d release/v1.2.0
```

### **Hotfix Process**
```bash
# Create hotfix from master
git checkout master
git pull origin master
git checkout -b hotfix/critical-security-fix

# Make fix and test
git commit -m "fix: resolve critical security vulnerability"

# Merge to both master and develop
git checkout master
git merge --no-ff hotfix/critical-security-fix
git tag -a v1.2.1 -m "Hotfix version 1.2.1"

git checkout develop
git merge --no-ff hotfix/critical-security-fix

git push origin master develop --tags
git branch -d hotfix/critical-security-fix
```

---

## 📝 **Commit Message Convention**

### **Format:**
```
type(scope): short description

Detailed description of what was changed and why.
Include any breaking changes or migration notes.

- Bullet point details
- Related issues: #123, #456
- Breaking change: describe what breaks
```

### **Types:**
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style/formatting
- **refactor**: Code refactoring
- **test**: Adding/updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

### **Scopes:**
- **flutter**: Mobile app changes
- **admin**: Admin frontend changes
- **api**: API gateway changes
- **vehicle-service**: Vehicle service changes
- **user-service**: User service changes
- **booking-service**: Booking service changes
- **notification-service**: Notification service changes
- **db**: Database changes
- **docker**: Container/deployment changes

---

## ⚡ **Quick Commands**

### **Daily Workflow:**
```bash
# Start new feature
git checkout develop && git pull && git checkout -b feature/my-feature

# Quick commit
git add . && git commit -m "feat(scope): description"

# Push feature
git push -u origin feature/my-feature

# Update from develop
git checkout develop && git pull && git checkout - && git rebase develop

# Cleanup after merge
git checkout develop && git pull && git branch -d feature/my-feature
```

### **Check Status:**
```bash
# View current changes
git status

# View branch structure
git log --oneline --graph --decorate --all

# View commits on current branch
git log --oneline develop..HEAD

# Check what will be merged
git diff develop...feature/my-feature
```

### **Emergency Fixes:**
```bash
# Quick hotfix
git checkout master && git pull
git checkout -b hotfix/emergency-fix
# Make fix
git add . && git commit -m "fix: emergency repair"
git checkout master && git merge hotfix/emergency-fix
git tag v1.x.x && git push origin master --tags
```

---

## 🛠️ **Automated Scripts**

### **Feature Creation Script:**
```bash
#!/bin/bash
# create-feature.sh
FEATURE_NAME=$1
git checkout develop
git pull origin develop
git checkout -b feature/$FEATURE_NAME
git push -u origin feature/$FEATURE_NAME
echo "Feature branch feature/$FEATURE_NAME created and pushed"
```

### **Pre-commit Hook:**
```bash
#!/bin/bash
# Run tests before commit
cd car_rental_app && flutter analyze
cd ../backend && make lint
cd ../admin-frontend && npm run lint
```

---

## 📊 **Project Structure Integration**

### **Multi-Project Repository Structure:**
```
x369-workspace/
├── car_rental_app/          # Flutter mobile app
├── backend/                 # Go microservices
│   ├── api-gateway/
│   ├── vehicle-service/
│   ├── user-service/
│   ├── booking-service/
│   └── notification-service/
├── admin-frontend/          # React admin panel
├── docs/                    # Documentation
└── scripts/                 # Deployment scripts
```

### **Workflow Integration:**
- **Feature branches** can span multiple projects
- **Separate commits** for each project within feature
- **Integration testing** before merge to develop
- **Coordinated releases** across all projects

---

## 🎯 **Best Practices**

1. **Never commit directly to master or develop**
2. **Always create feature branches**
3. **Write descriptive commit messages**
4. **Test before committing**
5. **Keep feature branches small and focused**
6. **Regularly sync with develop**
7. **Use pull requests for code review**
8. **Tag all releases**
9. **Document breaking changes**
10. **Clean up merged branches**

---

This Git workflow ensures organized development, easy collaboration, and reliable releases for your car rental platform! 🚀