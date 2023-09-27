# utils/helpers/web3Contract.py
from etherscan import Etherscan

class web3Contract:
    def __init__(self, web3, ethscan):
        self.web3 = web3
        self.etherscan = Etherscan(ethscan)
        
    
    def createContract(self, address):
        print("TYPE web3: ",type(self.web3))
        print("Type etherscan: ", type(self.etherscan))

        contractAddress = self.web3.toChecksumAddress(address)
        abi = self.etherscan.get_contract_abi(address)
        contractInstance = self.web3.eth.contract(address=contractAddress, abi=abi)
        return contractInstance