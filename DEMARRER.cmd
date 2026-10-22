@echo off
setlocal
cd /d "%~dp0"
set "SB_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "SB_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist .env copy .env.example .env >nul
echo StudyBridge - ouvre http://localhost:3000 dans ton navigateur.
echo Garde cette fenetre ouverte. Pour arreter : Ctrl+C.
"%SB_NODE%" --env-file-if-exists=.env server.mjs
pause
