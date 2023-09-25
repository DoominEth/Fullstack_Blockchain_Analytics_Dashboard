from etherscan import Etherscan
from eth_utils import to_checksum_address

class web3Contract:
    def __init__(self, web3_instance, ETHERSCAN_API):
        self.web3 = web3_instance
        self.etherscan = Etherscan(ETHERSCAN_API)
    
    def createContract(self, address):
        contractAddress = to_checksum_address(address)
        abi = self.etherscan.get_contract_abi(address)
        contractInstance = self.web3.eth.contract(address=contractAddress, abi=abi)
        return contractInstance
