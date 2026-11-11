@echo off
setlocal
cd /d "%~dp0"
set "SB_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "SB_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist .env copy .env.example .env >nul
echo StudyBridge - Oeffne http://localhost:3000 im Browser.
echo Lasse dieses Fenster offen. Zum Beenden: Strg+C.
"%SB_NODE%" --env-file-if-exists=.env server.mjs
pause
