@echo off

REM Check if virtual environment exists, create it if necessary
if not exist blockchainDataEnv\Scripts\activate.bat (
    python -m venv blockchainDataEnv
)

REM Activate the virtual environment
call blockchainDataEnv\Scripts\activate.bat

REM Upgrade pip to ensure compatibility with newer packages
python -m pip install --upgrade pip

REM Install the required dependencies
pip install -r requirements.txt

REM Deactivate the virtual environment
deactivate

