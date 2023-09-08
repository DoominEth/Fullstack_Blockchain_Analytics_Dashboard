import asyncio
import cryo
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()
import os

INFURA_ENDPOINT = os.environ.get("INFURA_ENDPOINT")
os.environ["ETH_RPC_URL"] = INFURA_ENDPOINT
web3 = Web3(Web3.HTTPProvider(INFURA_ENDPOINT))

def get_blockchain_data(datatype, start_block, end_block, contract_address):
    data = cryo.collect(
        datatype,
        start_block=start_block,
        end_block=end_block,
        hex=True,
        contract=contract_address
    )
    return data
