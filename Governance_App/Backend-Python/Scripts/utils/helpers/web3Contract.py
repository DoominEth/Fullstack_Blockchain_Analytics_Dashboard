# utils/helpers/web3Contract.py
from etherscan import Etherscan

class web3Contract:
    def __init__(self, web3, ethscan):
        self.web3 = web3
        self.etherscan = Etherscan(ethscan)
        
    
    def createContract(self, address):
        #print("TYPE web3: ",type(self.web3))
        #print("Type etherscan: ", type(self.etherscan))

        try:
            contractAddress = self.web3.toChecksumAddress(address)
            abi = self.etherscan.get_contract_abi(address)
            contractInstance = self.web3.eth.contract(address=contractAddress, abi=abi)
            return contractInstance
        except:
            print("CONTRACT: ", contractAddress)
            print("ERROR: SMART CONTRACT HAD NO ABI")
            return None
        

    def createProxyContract(self, proxyAddress, targetAddress):
        contractAddress =  self.web3.toChecksumAddress(proxyAddress)
        abi = self.etherscan.get_contract_abi(targetAddress)
        contractInstance = self.web3.eth.contract(address=contractAddress, abi=abi)
        contractInstance.labels = []
        return contractInstance