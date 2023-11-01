import re
import requests
import pandas as pd


def fetch_github_content(url: str) -> str:
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        raise ValueError(f"Failed to fetch content. HTTP Status Code: {response.status_code}")


def extract_event_signature(script: str) -> list:
    event_pattern = re.compile(r"event (\w+):\s*\n(.*?)(?=\n\n|\Z)", re.DOTALL)
    events = event_pattern.findall(script)
    print(events)
    signatures = []
    names = []

    data = {
        'event_name': [],
        'event_and_params': []
    }

    for event in events:
        event_name = event[0]
        params = event[1].strip().split("\n")
        
        # Process each param to remove the 'indexed' keyword and any parentheses
        param_types = []
        for param in params:
            param_type = param.split(":")[1].strip()
            if "indexed" in param_type:
                param_type = param_type.replace("indexed(", "").replace(")", "").strip()
            param_types.append(param_type)
        
        signature = f"{event_name}({','.join(param_types)})"
        data['event_name'].append(event_name)
        data['event_and_params'].append(signature)
    
    df = pd.DataFrame(data)
    return df



def buildSolEvents(github_url,script):
    # Use regular expressions to find event declarations in Solidity
    event_regex = re.compile(r'event\s+(\w+)\(([^)]*)\);')
    events = event_regex.findall(script)
    
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


def extract_events_github(github_url):
    # Fetch the file content from GitHub
    response = requests.get(github_url)
    response.raise_for_status()  # Check if the request was successful
    script = response.text
    file_type = 'sol' if github_url.endswith('.sol') else 'vy' if github_url.endswith('.vy') else None
    if file_type is None:
        raise ValueError("Unsupported file type. URL should end with .sol or .vy")
    
    if file_type == 'sol':
        df = buildSolEvents(github_url, script)
        print(df)
        return df 
        # Add your Solidity parsing logic here if needed
    elif file_type == 'vy':
        content = fetch_github_content(github_url)
        #print("Vyper:")
        #print(content)
        df = extract_event_signature(content)

        return df

