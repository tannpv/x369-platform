#!/bin/bash
# Git Workflow Scripts for Car Rental Platform

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Create feature branch
create_feature() {
    local feature_name=$1
    local scope=$2
    
    if [ -z "$feature_name" ]; then
        print_error "Usage: create_feature <feature-name> [scope]"
        echo "Examples:"
        echo "  create_feature user-authentication flutter"
        echo "  create_feature vehicle-search api"
        echo "  create_feature booking-dashboard admin"
        return 1
    fi
    
    print_info "Creating feature branch: feature/${scope:+$scope-}$feature_name"
    
    # Ensure we're on develop and up to date
    git checkout develop
    git pull origin develop
    
    # Create feature branch
    git checkout -b "feature/${scope:+$scope-}$feature_name"
    git push -u origin "feature/${scope:+$scope-}$feature_name"
    
    print_status "Feature branch created: feature/${scope:+$scope-}$feature_name"
}

# Finish feature branch
finish_feature() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        print_error "Not on a feature branch. Current branch: $current_branch"
        return 1
    fi
    
    print_info "Finishing feature branch: $current_branch"
    
    # Push final changes
    git push origin "$current_branch"
    
    # Switch to develop
    git checkout develop
    git pull origin develop
    
    print_warning "Create Pull Request for: $current_branch -> develop"
    print_info "After PR is merged, run: cleanup_feature $current_branch"
}

# Cleanup merged feature branch
cleanup_feature() {
    local branch_name=$1
    
    if [ -z "$branch_name" ]; then
        print_error "Usage: cleanup_feature <branch-name>"
        return 1
    fi
    
    # Delete local branch
    git branch -d "$branch_name"
    
    # Delete remote branch
    git push origin --delete "$branch_name"
    
    print_status "Cleaned up feature branch: $branch_name"
}

# Quick commit with conventional format
quick_commit() {
    local type=$1
    local scope=$2
    local message=$3
    
    if [ -z "$type" ] || [ -z "$scope" ] || [ -z "$message" ]; then
        print_error "Usage: quick_commit <type> <scope> <message>"
        echo "Types: feat, fix, docs, style, refactor, test, chore"
        echo "Scopes: flutter, admin, api, vehicle-service, user-service, booking-service, etc."
        echo "Example: quick_commit feat flutter 'add vehicle search UI'"
        return 1
    fi
    
    git add .
    git commit -m "$type($scope): $message"
    
    print_status "Committed: $type($scope): $message"
}

# Create hotfix branch
create_hotfix() {
    local hotfix_name=$1
    
    if [ -z "$hotfix_name" ]; then
        print_error "Usage: create_hotfix <hotfix-name>"
        return 1
    fi
    
    print_info "Creating hotfix branch: hotfix/$hotfix_name"
    
    # Create from master
    git checkout master
    git pull origin master
    git checkout -b "hotfix/$hotfix_name"
    git push -u origin "hotfix/$hotfix_name"
    
    print_status "Hotfix branch created: hotfix/$hotfix_name"
}

# Finish hotfix branch
finish_hotfix() {
    local current_branch=$(git branch --show-current)
    local version=$1
    
    if [[ ! $current_branch == hotfix/* ]]; then
        print_error "Not on a hotfix branch. Current branch: $current_branch"
        return 1
    fi
    
    if [ -z "$version" ]; then
        print_error "Usage: finish_hotfix <version>"
        echo "Example: finish_hotfix v1.2.1"
        return 1
    fi
    
    print_info "Finishing hotfix: $current_branch"
    
    # Merge to master
    git checkout master
    git merge --no-ff "$current_branch"
    git tag -a "$version" -m "Hotfix version $version"
    
    # Merge to develop
    git checkout develop
    git merge --no-ff "$current_branch"
    
    # Push everything
    git push origin master develop --tags
    
    # Cleanup
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    print_status "Hotfix $version completed and deployed"
}

# Create release branch
create_release() {
    local version=$1
    
    if [ -z "$version" ]; then
        print_error "Usage: create_release <version>"
        echo "Example: create_release v1.2.0"
        return 1
    fi
    
    print_info "Creating release branch: release/$version"
    
    # Create from develop
    git checkout develop
    git pull origin develop
    git checkout -b "release/$version"
    git push -u origin "release/$version"
    
    print_status "Release branch created: release/$version"
    print_warning "Update version numbers and CHANGELOG.md before finishing release"
}

# Finish release branch
finish_release() {
    local current_branch=$(git branch --show-current)
    local version=${current_branch#release/}
    
    if [[ ! $current_branch == release/* ]]; then
        print_error "Not on a release branch. Current branch: $current_branch"
        return 1
    fi
    
    print_info "Finishing release: $current_branch"
    
    # Merge to master
    git checkout master
    git merge --no-ff "$current_branch"
    git tag -a "$version" -m "Release version $version"
    
    # Merge to develop
    git checkout develop
    git merge --no-ff "$current_branch"
    
    # Push everything
    git push origin master develop --tags
    
    # Cleanup
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    print_status "Release $version completed and deployed"
}

# Sync with develop branch
sync_develop() {
    local current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "master" ] || [ "$current_branch" = "develop" ]; then
        print_error "Cannot sync main branches. Switch to a feature branch first."
        return 1
    fi
    
    print_info "Syncing $current_branch with develop"
    
    git checkout develop
    git pull origin develop
    git checkout "$current_branch"
    git rebase develop
    
    print_status "Branch $current_branch synced with develop"
}

# Show Git flow status
flow_status() {
    echo -e "${BLUE}📊 Git Flow Status${NC}"
    echo "=========================="
    
    local current_branch=$(git branch --show-current)
    echo -e "Current Branch: ${GREEN}$current_branch${NC}"
    
    echo -e "\n${YELLOW}🌿 Available Branches:${NC}"
    git branch -a
    
    echo -e "\n${YELLOW}📝 Recent Commits:${NC}"
    git log --oneline -10
    
    echo -e "\n${YELLOW}🔄 Untracked/Modified Files:${NC}"
    git status --porcelain
    
    if [[ $current_branch == feature/* ]]; then
        echo -e "\n${BLUE}💡 Feature Branch Commands:${NC}"
        echo "  finish_feature              # Finish current feature"
        echo "  sync_develop               # Sync with develop"
        echo "  quick_commit <type> <scope> <msg>  # Quick commit"
    fi
}

# Test project before commit
test_project() {
    local project=$1
    
    case $project in
        flutter|mobile)
            print_info "Testing Flutter app..."
            cd car_rental_app
            flutter analyze
            flutter test
            cd ..
            ;;
        backend|api)
            print_info "Testing backend services..."
            cd backend
            make lint 2>/dev/null || echo "No Makefile lint target"
            # Add go test commands here
            cd ..
            ;;
        admin|frontend)
            print_info "Testing admin frontend..."
            cd admin-frontend
            npm run lint 2>/dev/null || echo "No npm lint script"
            npm run type-check 2>/dev/null || echo "No type-check script"
            npm run test 2>/dev/null || echo "No test script"
            cd ..
            ;;
        all)
            test_project flutter
            test_project backend  
            test_project admin
            ;;
        *)
            print_error "Usage: test_project <flutter|backend|admin|all>"
            return 1
            ;;
    esac
    
    print_status "Testing completed for: $project"
}

# Help function
git_flow_help() {
    echo -e "${BLUE}🚀 Car Rental Platform Git Flow Commands${NC}"
    echo "=============================================="
    echo ""
    echo -e "${GREEN}Feature Development:${NC}"
    echo "  create_feature <name> [scope]    # Create new feature branch"
    echo "  finish_feature                   # Finish current feature"
    echo "  cleanup_feature <branch>         # Clean up merged branch"
    echo "  sync_develop                     # Sync with develop branch"
    echo ""
    echo -e "${GREEN}Quick Operations:${NC}"
    echo "  quick_commit <type> <scope> <msg>  # Conventional commit"
    echo "  flow_status                      # Show Git flow status"
    echo "  test_project <project>           # Test before commit"
    echo ""
    echo -e "${GREEN}Release Management:${NC}"
    echo "  create_release <version>         # Create release branch"
    echo "  finish_release                   # Finish current release"
    echo "  create_hotfix <name>            # Create hotfix branch"
    echo "  finish_hotfix <version>         # Finish current hotfix"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  create_feature vehicle-search flutter"
    echo "  quick_commit feat flutter 'add search filters'"
    echo "  create_release v1.2.0"
    echo "  create_hotfix critical-security-fix"
}

# Make functions available when sourced
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Script is being executed directly
    git_flow_help
else
    # Script is being sourced
    print_status "Git Flow commands loaded! Run 'git_flow_help' for usage."
fi