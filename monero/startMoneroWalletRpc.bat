@REM 1. Download the latest version of the Monero wallet RPC from https://www.getmonero.org/downloads/#cli
@REM 2. Unzip the file
@REM 3. Copy this file to the same folder as the monero-wallet-rpc.exe file
@REM 3. Run monero daemon with the following command: monerod.exe --stagenet
@REM 4. Run this file ./startMoneroWalletRpc.bat

@REM Start Monero Wallet RPC

@REM Using stage-net stagenet.community.rino.io
@REM demo username: rpc_user
@REM demo password: rpc_pass

monero-wallet-rpc.exe --daemon-address stagenet.community.rino.io:38081 --stagenet --rpc-bind-port 28081 --rpc-login rpc_user:rpc_pass --wallet-dir .\