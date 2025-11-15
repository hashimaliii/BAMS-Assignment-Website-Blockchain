@echo off
REM BAMS Quick Deployment Script (Windows)
REM This script helps set up your project for deployment to various platforms

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo BAMS Deployment Helper Script (Windows)
echo ==========================================
echo.

REM Function to create .gitignore
:create_gitignore
if not exist .gitignore (
    (
        echo node_modules/
        echo npm-debug.log
        echo .env
        echo .env.local
        echo .env.*.local
        echo dist/
        echo build/
        echo .DS_Store
        echo *.log
        echo .vercel
        echo .vercel/
    ) > .gitignore
    echo ✓ Created .gitignore
)
goto :EOF

REM Function to create .env.example
:create_env_example
if not exist .env.example (
    (
        echo # Environment Configuration
        echo NODE_ENV=production
        echo PORT=3000
        echo.
        echo # Optional: Database Configuration
        echo # DB_HOST=localhost
        echo # DB_USER=root
        echo # DB_PASSWORD=
        echo # DB_NAME=bams_db
    ) > .env.example
    echo ✓ Created .env.example
)
goto :EOF

REM Function to create vercel.json
:create_vercel_config
if not exist vercel.json (
    (
        echo {
        echo   "version": 2,
        echo   "builds": [
        echo     {
        echo       "src": "backend/index.js",
        echo       "use": "@vercel/node"
        echo     }
        echo   ],
        echo   "routes": [
        echo     {
        echo       "src": "/api/(.*)",
        echo       "dest": "/backend/index.js"
        echo     },
        echo     {
        echo       "src": "/(.*)",
        echo       "dest": "/backend/index.js"
        echo     }
        echo   ],
        echo   "env": {
        echo     "NODE_ENV": "production"
        echo   }
        echo }
    ) > vercel.json
    echo ✓ Created vercel.json for Vercel deployment
)
goto :EOF

REM Function to create Dockerfile
:create_dockerfile
if not exist Dockerfile (
    (
        echo FROM node:18-alpine
        echo.
        echo WORKDIR /app
        echo.
        echo # Copy package files
        echo COPY package*.json ./
        echo.
        echo # Install dependencies
        echo RUN npm ci --only=production
        echo.
        echo # Copy application files
        echo COPY . .
        echo.
        echo # Expose port
        echo EXPOSE 3000
        echo.
        echo # Start application
        echo CMD ["npm", "start"]
    ) > Dockerfile
    echo ✓ Created Dockerfile for containerized deployment
)
goto :EOF

REM Function to create .dockerignore
:create_dockerignore
if not exist .dockerignore (
    (
        echo node_modules
        echo npm-debug.log
        echo .git
        echo .gitignore
        echo README.md
        echo .env
        echo .DS_Store
        echo dist
        echo build
    ) > .dockerignore
    echo ✓ Created .dockerignore
)
goto :EOF

REM Main menu
:menu
echo.
echo Select deployment platform:
echo 1) Vercel - Recommended for quick deploy
echo 2) Railway - Recommended for persistence
echo 3) Render - Free with auto-sleep
echo 4) AWS EC2 - Free 12 months
echo 5) All - Create all config files
echo 6) Exit
echo.
set /p choice="Enter choice [1-6]: "

if "%choice%"=="1" goto vercel_setup
if "%choice%"=="2" goto railway_setup
if "%choice%"=="3" goto render_setup
if "%choice%"=="4" goto aws_setup
if "%choice%"=="5" goto all_setup
if "%choice%"=="6" goto end
echo Invalid choice. Please try again.
goto menu

:vercel_setup
echo.
echo Setting up for Vercel...
call :create_gitignore
call :create_env_example
call :create_vercel_config
echo.
echo ✓ Vercel setup complete!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to https://vercel.com
echo 3. Click 'New Project' and import your repo
echo 4. Deploy!
echo.
goto continue_menu

:railway_setup
echo.
echo Setting up for Railway...
call :create_gitignore
call :create_env_example
call :create_dockerfile
call :create_dockerignore
echo.
echo ✓ Railway setup complete!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to https://railway.app
echo 3. Click 'New Project' and select your repo
echo 4. Railway will auto-detect and deploy!
echo.
goto continue_menu

:render_setup
echo.
echo Setting up for Render...
call :create_gitignore
call :create_env_example
call :create_dockerfile
call :create_dockerignore
echo.
echo ✓ Render setup complete!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to https://render.com
echo 3. Click 'New Web Service'
echo 4. Connect your GitHub repository
echo 5. Deploy!
echo.
goto continue_menu

:aws_setup
echo.
echo Setting up for AWS EC2...
echo.
echo This requires manual setup. See DEPLOYMENT_GUIDE.md for:
echo - Creating EC2 instance
echo - Installing Node.js and dependencies
echo - Configuring Nginx reverse proxy
echo - SSL certificate setup
echo.
pause
goto continue_menu

:all_setup
echo.
echo Creating all configuration files...
call :create_gitignore
call :create_env_example
call :create_vercel_config
call :create_dockerfile
call :create_dockerignore
echo.
echo ✓ All deployment configs created!
echo.
echo Files created:
echo   - .gitignore
echo   - .env.example
echo   - vercel.json (for Vercel)
echo   - Dockerfile (for Railway/Render)
echo   - .dockerignore
echo.
echo You can now deploy to any platform!
echo.
goto continue_menu

:continue_menu
set /p continue="Would you like to do something else? (y/n): "
if "%continue%"=="y" goto menu
if "%continue%"=="Y" goto menu

:end
echo.
echo ==========================================
echo Setup complete! Happy deploying! 🚀
echo ==========================================
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
