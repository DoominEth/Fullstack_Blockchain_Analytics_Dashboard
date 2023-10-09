import re
import pandas as pd
import requests

def extract_events_vyper(github_url):
    # Send an HTTP GET request to the GitHub URL to fetch the Vyper code
    response = requests.get(github_url)
    response.raise_for_status()  # Check if the request was successful
    vyper_code = response.text

    # Regular expression to match event declarations
    event_regex = re.compile(r'event\s+(\w+):\s*\n\s*([\s\S]+?)(?:\n(?=event|\n)|\n?$)', re.MULTILINE)
    
    # Find all matches
    events = event_regex.findall(vyper_code)
    
    # Prepare data for DataFrame
    data = {
        'event_name': [],
        'event_and_params': []
    }
    
    for event in events:
        event_name = event[0]
        param_lines = event[1].split('\n')
        params = [param.strip() for param in param_lines if param.strip()]
        param_types = [param.split(':')[0].strip() for param in params]  # Extract data type only
        param_string = ','.join(param_types)
        event_and_params = f"{event_name}({param_string})"
        data['event_name'].append(event_name)
        data['event_and_params'].append(event_and_params)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    return df

