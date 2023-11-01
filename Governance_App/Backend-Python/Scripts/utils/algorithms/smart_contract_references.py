def detect_smart_contract_references(contract):
    contractABI = contract.abi
    child_addresses = []  # initialize an empty list to hold the addresses

    for i in range(len(contractABI)):
        # Ensure 'outputs' exists and is non-empty before accessing it
        outputs = contractABI[i].get('outputs', [])
        if outputs and outputs[0].get('type') == 'address':
            if not contractABI[i].get('inputs'):  # equivalent to checking len(contractABI[i]['inputs']) == 0
                try:
                    # Call the contract function and get the address
                    child_address = eval(
                        "contract.functions." + contractABI[i]['name'] + "().call()")
                    
                    # Add the found name and address as a dictionary to the list
                    child_addresses.append({
                        'name': contractABI[i]['name'],
                        'address': child_address
                    })
                except Exception as e:
                    print(f"An error occurred: {e}")  # Handle exceptions here
        elif outputs and outputs[0].get('type') == 'address[]':
            print("ARRAY OF ADDRESSES DETECTED!")
            try:
                # Call the contract function and get the array of addresses
                child_addresses_array = eval("contract.functions." + contractABI[i]['name'] + "().call()")
                for address in child_addresses_array:
                    child_addresses.append({
                        'name': contractABI[i]['name'],
                        'address': address
                    })
                print("ARRAY OF ADDRESSES ADDED")
            except Exception as e:
                print(f"An error occurred when retrieving array of addresses: {e}")
    return child_addresses
