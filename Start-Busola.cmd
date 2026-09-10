@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "if (-not (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue)) { Start-Process -FilePath (Get-Command node).Source -ArgumentList 'serve.mjs' -WorkingDirectory (Get-Location).Path -WindowStyle Hidden }; for ($attempt=0; $attempt -lt 30; $attempt++) { if (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue) { Start-Process 'http://127.0.0.1:8080/'; exit 0 }; Start-Sleep -Milliseconds 200 }; Write-Error 'Busola server did not start'; exit 1"
if errorlevel 1 pause
