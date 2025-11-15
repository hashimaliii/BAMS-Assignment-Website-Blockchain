#!/bin/bash
# BAMS Quick Deployment Script
# This script helps set up your project for deployment to various platforms

set -e

echo "=========================================="
echo "BAMS Deployment Helper Script"
echo "=========================================="
echo ""

# Function to create .gitignore
create_gitignore() {
    if [ ! -f .gitignore ]; then
        cat > .gitignore << 'EOF'
node_modules/
npm-debug.log
.env
.env.local
.env.*.local
dist/
build/
.DS_Store
*.log
.vercel
.vercel/
EOF
        echo "✓ Created .gitignore"
    fi
}

# Function to create .env.example
create_env_example() {
    if [ ! -f .env.example ]; then
        cat > .env.example << 'EOF'
# Environment Configuration
NODE_ENV=production
PORT=3000

# Optional: Database Configuration
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=bams_db
EOF
        echo "✓ Created .env.example"
    fi
}

# Function to create vercel.json
create_vercel_config() {
    if [ ! -f vercel.json ]; then
        cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/backend/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
        echo "✓ Created vercel.json for Vercel deployment"
    fi
}

# Function to create Railway config
create_railway_config() {
    if [ ! -f railway.json ]; then
        cat > railway.json << 'EOF'
{
  "build": {
    "builder": "dockerfile"
  }
}
EOF
        echo "✓ Created railway.json for Railway deployment"
    fi
}

# Function to create Dockerfile for Railway/Render
create_dockerfile() {
    if [ ! -f Dockerfile ]; then
        cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
EOF
        echo "✓ Created Dockerfile for containerized deployment"
    fi
}

# Function to create .dockerignore
create_dockerignore() {
    if [ ! -f .dockerignore ]; then
        cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
dist
build
EOF
        echo "✓ Created .dockerignore"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Select deployment platform:"
    echo "1) Vercel (Recommended for quick deploy)"
    echo "2) Railway (Recommended for persistence)"
    echo "3) Render (Free with auto-sleep)"
    echo "4) AWS EC2 (Free 12 months)"
    echo "5) All (Create all config files)"
    echo "6) Exit"
    echo ""
    read -p "Enter choice [1-6]: " choice
}

# Process choice
process_choice() {
    case $choice in
        1)
            echo ""
            echo "Setting up for Vercel..."
            create_gitignore
            create_env_example
            create_vercel_config
            echo ""
            echo "✓ Vercel setup complete!"
            echo ""
            echo "Next steps:"
            echo "1. Push to GitHub: git push origin main"
            echo "2. Go to https://vercel.com"
            echo "3. Click 'New Project' and import your repo"
            echo "4. Deploy!"
            ;;
        2)
            echo ""
            echo "Setting up for Railway..."
            create_gitignore
            create_env_example
            create_railway_config
            create_dockerfile
            create_dockerignore
            echo ""
            echo "✓ Railway setup complete!"
            echo ""
            echo "Next steps:"
            echo "1. Push to GitHub: git push origin main"
            echo "2. Go to https://railway.app"
            echo "3. Click 'New Project' and select your repo"
            echo "4. Railway will auto-detect and deploy!"
            ;;
        3)
            echo ""
            echo "Setting up for Render..."
            create_gitignore
            create_env_example
            create_dockerfile
            create_dockerignore
            echo ""
            echo "✓ Render setup complete!"
            echo ""
            echo "Next steps:"
            echo "1. Push to GitHub: git push origin main"
            echo "2. Go to https://render.com"
            echo "3. Click 'New Web Service'"
            echo "4. Connect your GitHub repository"
            echo "5. Deploy!"
            ;;
        4)
            echo ""
            echo "Setting up for AWS EC2..."
            echo ""
            echo "This requires manual setup. See DEPLOYMENT_GUIDE.md for:"
            echo "- Creating EC2 instance"
            echo "- Installing Node.js and dependencies"
            echo "- Configuring Nginx reverse proxy"
            echo "- SSL certificate setup"
            echo ""
            read -p "Press Enter to continue..."
            ;;
        5)
            echo ""
            echo "Creating all configuration files..."
            create_gitignore
            create_env_example
            create_vercel_config
            create_railway_config
            create_dockerfile
            create_dockerignore
            echo ""
            echo "✓ All deployment configs created!"
            echo ""
            echo "Files created:"
            echo "  - .gitignore"
            echo "  - .env.example"
            echo "  - vercel.json (for Vercel)"
            echo "  - railway.json (for Railway)"
            echo "  - Dockerfile (for Railway/Render)"
            echo "  - .dockerignore"
            echo ""
            echo "You can now deploy to any platform!"
            ;;
        6)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
}

# Check if git is initialized
if [ ! -d .git ]; then
    echo "⚠️  Warning: Not a git repository"
    echo ""
    read -p "Initialize git? (y/n): " init_git
    if [ "$init_git" = "y" ]; then
        git init
        echo "✓ Git initialized"
    fi
fi

# Main loop
while true; do
    show_menu
    process_choice
    echo ""
    read -p "Would you like to do something else? (y/n): " continue_choice
    if [ "$continue_choice" != "y" ]; then
        break
    fi
done

echo ""
echo "=========================================="
echo "Setup complete! Happy deploying! 🚀"
echo "=========================================="
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
