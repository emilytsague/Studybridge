@echo off
setlocal
cd /d "%~dp0"
set "SB_PYTHON=python"
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" set "SB_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
"%SB_PYTHON%" -m venv .voice-runtime
if errorlevel 1 goto failure
".voice-runtime\Scripts\python.exe" -m pip install -r scripts\voice-requirements.txt
if errorlevel 1 goto failure
".voice-runtime\Scripts\python.exe" -m piper.download_voices fr_FR-siwis-medium --download-dir voices
if errorlevel 1 goto failure
echo Voix installee. Demarre ou redemarre StudyBridge.
pause
exit /b 0
:failure
echo Installation interrompue. Verifie Python et la connexion Internet, puis reessaie.
pause
exit /b 1
