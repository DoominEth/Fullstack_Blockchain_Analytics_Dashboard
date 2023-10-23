from web3.exceptions import ContractLogicError

# Define the patterns in arrays of dictionaries
STORAGE_PATTERNS = [
    {"name": "EIP-1967 Direct Proxy", "slot": '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'},
    {"name": "OpenZeppelin Proxy", "slot": '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3'},
    {"name": "EIP-1822 UUPS", "slot": '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7'},
]

FUNCTION_PATTERNS = [
    {"name": "EIP-897 DelegateProxy", "signature": '0x5c60da1b'},
    {"name": "GnosisSafeProxy", "signature": '0xa619486e'},
    {"name": "ComptrollerProxy", "signature": '0xbb82aa5e'},
]

def detect_proxy_target(proxy_address):
    # Check storage patterns
    for pattern in STORAGE_PATTERNS:
        value = web3.eth.get_storage_at(proxy_address, pattern["slot"])
        value_hex = value.hex()
        if value and value != 0 and len(value_hex) == 42 and value_hex != '0x0000000000000000000000000000000000000000':
            return (pattern["name"], web3.to_checksum_address(value_hex))

    for pattern in FUNCTION_PATTERNS:
        try:
            result = web3.eth.call({'to': proxy_address, 'data': pattern["signature"]})
            if result and len(result) == 32 and result != b'\x00' * 32:
                # Extract the relevant part of the address
                relevant_address_part = result.hex()[-40:]
                formatted_address = '0x' + relevant_address_part
                return (pattern["name"], web3.to_checksum_address(formatted_address))
        except ContractLogicError:
            continue 

    return None, None