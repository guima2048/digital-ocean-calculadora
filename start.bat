@echo off
title Calculadora Sugar - Servidor

:: Definir cores
set "verde=[32m"
set "vermelho=[31m"
set "amarelo=[33m"
set "azul=[34m"
set "reset=[0m"

:: Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %vermelho%Node.js não encontrado!%reset%
    echo %amarelo%Por favor, instale o Node.js de https://nodejs.org%reset%
    echo.
    echo Pressione qualquer tecla para abrir o site do Node.js...
    pause >nul
    start https://nodejs.org
    exit /b 1
)

:: Verificar versão do Node.js
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set "node_version=%%a"
)
if "%node_version:~1%" LSS "16" (
    echo %vermelho%Versão do Node.js muito antiga!%reset%
    echo %amarelo%Por favor, atualize para a versão 16 ou superior%reset%
    echo.
    pause
    exit /b 1
)

:: Verificar se os módulos estão instalados
if not exist "node_modules" (
    echo %amarelo%Instalando dependências...%reset%
    echo.
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo %vermelho%Erro ao instalar dependências!%reset%
        echo.
        pause
        exit /b 1
    )
)

:: Verificar se o arquivo .env existe
if not exist ".env" (
    echo %amarelo%Criando arquivo .env...%reset%
    (
        echo PORT=3000
        echo MONGODB_URI=mongodb://localhost:27017/calculadora
        echo JWT_SECRET=chave_secreta_temporaria
    ) > .env
    echo %verde%Arquivo .env criado com sucesso!%reset%
    echo.
)

:: Limpar a tela
cls

:: Arte ASCII
echo %azul%
echo    ____      __            __           __                
echo   / __/___ _/ /______  __ / /___ ______/ /___  _________ 
echo  / /_/ __ `/ / ___/ / / // / __ `/ ___/ / __ \/ ___/ __ \
echo / __/ /_/ / / /__/ /_/ // / /_/ / /__/ / /_/ / /  / /_/ /
echo /_/  \__,_/_/\___/\__,_//_/\__,_/\___/_/\____/_/   \____/ 
echo.
echo %verde%=== Servidor da Calculadora Sugar ===%reset%
echo.

:: Iniciar o servidor
echo %azul%Iniciando o servidor...%reset%
echo.
node start-server.js

:: Se o servidor parar, aguardar input antes de fechar
echo.
echo %vermelho%Servidor finalizado.%reset%
echo.
pause 