from utils.config import Config

class ValidationError(Exception):
    pass

def is_ethereum_address(address):
    if not address:
        return False
    return Config.web3.isAddress(address)

def is_contract(address):
    code = Config.web3.eth.getCode(address)
    code_hex = code.hex()
    return code_hex != "0x"

def validate_contract_address(address):
    if not is_ethereum_address(address):
        return False
    
    return is_contract(address)

def is_integer(value):
    try:
        int(value)
        return True
    except (TypeError, ValueError):
        return False

def validate_block_numbers(start_block, end_block):
    if start_block >= end_block:
        raise ValidationError("Start block must be less than end block")
    

def validate(contract_address, start_block, end_block):
    if not all([contract_address, start_block, end_block]):
        raise ValidationError("Missing parameters")

    if not all(map(is_integer, [start_block, end_block])):
        raise ValidationError("Start block and End block must be integers")

    validate_block_numbers(start_block, end_block)

    if not validate_contract_address(contract_address):
        raise ValidationError("Invalid contract address")