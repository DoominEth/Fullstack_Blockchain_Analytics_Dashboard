
from collections import deque
from utils.config   import Config
from utils.algorithms.smart_contract_labeling import smart_contract_labeler
from utils.algorithms.smart_contract_references import detect_smart_contract_references
from utils.algorithms.proxy_detection import detect_proxy_target

def bfs_contract_reference(contract_address, max_depth):
    visited = set()
    queue = deque([(contract_address, 0)])  
    network_data = []

    contract_helper =Config.contract_helper
    while queue:
        current_address, current_depth = queue.popleft() 
        children = []
        label = []
        stop = False
        #print("Currently searching in BFS:" , current_address )
        #print("Current depth: ", current_depth )
        
        if current_address in visited:
            continue 
        
   
        visited.add(current_address)


        #Burn Check
        if current_address == '0x0000000000000000000000000000000000000000':
            network_data.append({
                'contract_address': current_address,
                'label': ['Burn'],
                'reference_contracts': []
            })
            continue

        # EOA CHECK
        if Config.web3.eth.getCode(current_address) == b'':
            network_data.append({
                'contract_address': current_address,
                'label': ['EOA'],
                'reference_contracts': []
            })
            continue

 
        #PROXY CHECK
        proxyType, implementationAddress = detect_proxy_target(current_address)
        if proxyType and implementationAddress:
            proxy_child = {
                'name': 'Implementation',
                'address': implementationAddress
            }
            children.append(proxy_child)
            label = [proxyType]  # type of proxy

        else:
            # LABELING
            label, stop = smart_contract_labeler(current_address)
            if max_depth == current_depth:
                stop = True


            if current_depth > max_depth:
                network_data.append({
                'contract_address': current_address,
                'label': [label, "!MAX_SEARCH_DEPTH"],
                'reference_contracts': children
                })
                continue


        try:
            if implementationAddress:
                currentContract =  contract_helper.createProxyContract(current_address, implementationAddress)
            else:
                currentContract = contract_helper.createContract(current_address)

            #currentContract = contract_helper.createContract(current_address)
            ref_children = detect_smart_contract_references(currentContract)
            children.extend(ref_children)  # Appends the children from the reference check to the existing children list
        except:
            print("Could not create the smart contract")

        network_data.append({
            'contract_address': current_address,
            'label': label,
            'reference_contracts': children
        })

        # if stop:
        #     continue

        ### LABELING END

        # for child in children:
        #     print('Child' , child)

        # Add children to the BFS queue
        for child in children:
            child_address = child['address']
            #print('Adding: ', child_address)
            new_depth = current_depth + 1
            queue.append((child_address, new_depth))


    return network_data 