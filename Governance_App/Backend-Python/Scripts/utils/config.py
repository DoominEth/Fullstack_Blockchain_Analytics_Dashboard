import os
from web3 import Web3
from utils.helpers.web3Contract import web3Contract

class Config:
    INFURA_ENDPOINT = os.environ.get("INFURA_ENDPOINT")
    ETHERSCAN_API = os.environ.get("ETHERSCAN_API")

    web3 = Web3(Web3.HTTPProvider(INFURA_ENDPOINT))
    contract_helper = web3Contract(web3, ETHERSCAN_API)

    os.environ["ETH_RPC_URL"] = INFURA_ENDPOINT

