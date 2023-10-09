
from collections import deque
from utils.config   import Config
from utils.algorithms.smart_contract_labeling import smart_contract_labeler
from utils.algorithms.smart_contract_references import detect_smart_contract_references


def bfs_contract_reference(contract_address, max_depth):
    visited = set()
    queue = deque([(contract_address, 0)])  
    network_data = []

    contract_helper =Config.contract_helper
    while queue:
        current_address, current_depth = queue.popleft() 

        print("Currently searching in BFS:" , current_address )
        print("Current depth: ", current_depth )
        
        if current_address in visited or current_depth > max_depth:
            continue 
        
   
        visited.add(current_address)


        
        # Label the contract
        label = smart_contract_labeler(current_address)
        print("Finished Label")

        # Find children
        try:
            currentContract = contract_helper.createContract(current_address)
          
            children = detect_smart_contract_references(currentContract) #TO DO: Move this contract creation
        except:
            print("Could not create the smart contract")
            children = []
        #children = find_children(current_address)
        
        # Save to database or some other data structure
        network_data.append({
            'contract_address': current_address,
            'label': label,
            'reference_contracts': children
        })

        print("Finished Data append")        

        for child in children:
            print('Child' , child)

        # Add children to the BFS queue
        for child in children:
            child_address = child['address']
            print('Adding: ', child_address)
            new_depth = current_depth + 1
            queue.append((child_address, new_depth))


    return network_data 