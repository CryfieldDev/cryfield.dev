@echo off
if "%1"=="start" goto start
if "%1"=="stop" goto stop
echo.
echo Uso: server.bat [start^|stop]
echo.
echo   start   Enciende el dev server y el tunel de serveo con cry.is-a.dev
echo   stop    Apaga todo
echo.
goto :eof

:start
echo [1/2] Iniciando Astro en puerto 3000...
start "Astro Dev" cmd /k "npm run dev -- --host"
echo.
echo [2/2] Conectando serveo.net para cry.is-a.dev...
start "Serveo Tunnel" cmd /k "ssh -R cry.is-a.dev:80:localhost:3000 serveo.net"
echo.
echo Listo. El sitio estara en https://cry.is-a.dev
echo Las ventanas deben quedar abiertas. Usa "server.bat stop" para apagar.
goto :eof

:stop
echo Apagando servidores...
taskkill /f /fi "WINDOWTITLE eq Astro Dev" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Serveo Tunnel" >nul 2>&1
echo Servidores apagados.
goto :eof
