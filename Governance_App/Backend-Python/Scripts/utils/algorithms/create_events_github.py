import re
import requests
import pandas as pd

def extract_events_github(github_url):

    file_type = 'sol' if github_url.endswith('.sol') else 'vy' if github_url.endswith('.vy') else None
    if file_type is None:
        raise ValueError("Unsupported file type. URL should end with .sol or .vy")
    
    if file_type is 'sol':
        print('Parsing Solidity file')
    else:
        print('File is vyper, not yet added to parser')

    # Fetch the file content from GitHub
    response = requests.get(github_url)
    response.raise_for_status()  # Check if the request was successful
    code = response.text
    
    # Use regular expressions to find event declarations
    event_regex = re.compile(r'event\s+(\w+)\(([^)]*)\);')
    events = event_regex.findall(code)
    
    # Prepare data for DataFrame
    data = {
        'event_name': [],
        'event_and_params': []
    }
    
    for event in events:
        event_name = event[0]
        params = event[1].split(',')
        param_types = [param.split()[0] for param in params]
        param_string = ','.join(param_types)
        event_and_params = f"{event_name}({param_string})"
        data['event_name'].append(event_name)
        data['event_and_params'].append(event_and_params)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    return df