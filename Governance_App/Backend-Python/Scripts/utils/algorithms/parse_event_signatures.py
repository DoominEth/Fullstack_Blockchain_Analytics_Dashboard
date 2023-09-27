import json

def parse_address(data: str) -> str:
    # Assuming the address is in hex format with 0x prefix
    return "0x" + data[-40:]

def parse_uint256(data: str) -> int:
    #if data.startswith("0x"):
    #    data = data[2:]
    return int(data, 16)

def parse_event_logs(dataDF, keys):
    for index, row in dataDF.iterrows():
        print(index)
        topic0 = row["topic0"]  # Assuming topic0 holds the event_signature
        
        # Try to find a match in the keys dataframe
        matched_row = keys[keys['event_signature'] == topic0]

        #if matched_row.index[0] != 8:
        #    continue  # Skip processing if the matched index is not 8

        # If no match found, continue to next row
        if matched_row.empty:
            continue
            
        # Extract the key (event_input) for the matched event
        key = json.loads(matched_row['event_input'].iloc[0])
        
        topic_counter = 1
        data_entries = {}  # Dictionary to store parsed data vals
        non_indexed_counter = 0  # Counter for non-indexed data

        for entry in key:
            # For indexed data
            if entry["indexed"] == True:
                data_value = row[f"topic{topic_counter}"]
                
                if entry["type"] == "address":
                    parsed_value = parse_address(data_value)
                elif entry["type"] == "uint256":
                    parsed_value = parse_uint256(data_value)
                else:
                    parsed_value = data_value
                
                dataDF.at[index, f"topic{topic_counter}"] = parsed_value
                topic_counter += 1

                #print('INDEXED!')
            # For non-indexed data
            else:
                data_str = row["data"]
                offset = 2 # for the '0x' prefix
                chunk = data_str[offset + non_indexed_counter*64 : offset + (non_indexed_counter+1)*64]
                
                #print(f"Processing index {index}")
                #print("Data string:", data_str)
                #print("Chunk:", chunk)

                if entry["type"] == "address":
                    parsed_value = parse_address(chunk)
                elif entry["type"] == "uint256":
                    parsed_value = parse_uint256(chunk)
                else:
                    parsed_value = chunk

                data_entries[entry['name']] = parsed_value
                non_indexed_counter += 1  # Increment the counter for non-indexed data

        # If there's more than one non-indexed entry, update the data column with a JSON string
        if len(data_entries) > 1:
            dataDF.at[index, "data"] = json.dumps(data_entries)
        elif data_entries:
            dataDF.at[index, "data"] = list(data_entries.values())[0]

    return dataDF
