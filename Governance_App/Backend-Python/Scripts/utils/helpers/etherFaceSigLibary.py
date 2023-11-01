import requests
import pandas as pd

BASE_URL = "https://api.etherface.io"
TEXT_ENDPOINT = "/v1/signatures/text/all/{}/{}"

def get_signatures(text_name, page_number):
    response = requests.get(BASE_URL + TEXT_ENDPOINT.format(text_name, page_number))
    if response.status_code == 200:
        return response.json()
    else:
        return None

def getEtherFaceLibrary(text_name):
    # Case sensitive API, do both.
    lowercase_name = text_name.lower()
    capitalized_name = text_name.capitalize()

    def get_entries_for_word(word):
        first_page = get_signatures(word, 1)
        if not first_page:
            return []

        total_pages = first_page["total_pages"]
        
        # Add 0x to hsah
        def format_hash(hash_value):
            return hash_value if hash_value.startswith("0x") else "0x" + hash_value

        entries = [{"keyword": word, "name": item["text"], "hash": format_hash(item["hash"])} for item in first_page["items"]]
        
        for page in range(2, total_pages + 1):
            page_data = get_signatures(word, page)
            if not page_data:
                continue
            entries.extend([{"keyword": word, "name": item["text"], "hash": format_hash(item["hash"])} for item in page_data["items"]])

        return entries
    
    # Fetch entries for both versions of the word
    lowercase_entries = get_entries_for_word(lowercase_name)
    capitalized_entries = get_entries_for_word(capitalized_name)

    # Combine results and convert to DataFrame
    all_entries = lowercase_entries + capitalized_entries
    df = pd.DataFrame(all_entries)

    return df
