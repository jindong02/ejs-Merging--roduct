#!/bin/sh

# 1. Download the latest version of the Monero wallet RPC from https://www.getmonero.org/downloads/#cli
# 2. Unzip the file
# 3. Copy this file to the same directory as the monero-wallet-rpc executable
# 4. Make this file executable: chmod +x startMoneroWalletRpc.sh
# 5. Run this file: ./startMoneroWalletRpc.sh

## (Optional) If you want to start your own Monero daemon, uncomment you can run the following command: ./monerod --stagenet

# Start Monero Wallet RPC

# Using stage-net stagenet.community.rino.io
# demo username: rpc_user
# demo password: rpc_pass


./monero-wallet-rpc --daemon-address stagenet.community.rino.io:38081 --stagenet --rpc-bind-port 28081 --rpc-login rpc_user:rpc_pass --wallet-dir ./
