@echo off
setlocal
cd /d "%~dp0"
set "SB_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "SB_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%SB_NODE%" --env-file-if-exists=.env scripts/maintenance.mjs reset-password
pause
