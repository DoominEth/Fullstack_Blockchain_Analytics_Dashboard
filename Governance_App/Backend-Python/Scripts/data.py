from flask import Flask, jsonify
from flask_cors import CORS  
import pandas as pd
import numpy as np
import sys

print("Python interpreter path:", sys.executable)

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    # Create a DataFrame with random data
    df = pd.DataFrame({
        'x': np.random.randint(0, 100, 10),
        'y': np.random.randint(0, 100, 10)
    })
    
    # Convert DataFrame to JSON
    data_json = df.to_json(orient='records')
    
    return jsonify(data=data_json)

if __name__ == '__main__':
    app.run(port=5000)
