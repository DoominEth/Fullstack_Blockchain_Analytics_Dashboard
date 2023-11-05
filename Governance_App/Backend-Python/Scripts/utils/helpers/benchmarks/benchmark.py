import os
import pandas as pd
from services.data_service import test_function_service
from utils.helpers.config import Web3

def run_benchmark():
   
   current_dir = os.getcwd()
   relative_path = r'Scripts\utils\helpers\benchmarks\DAO50.xlsx'
   file_path = os.path.join(current_dir, relative_path)

   print(file_path)
   print("INSIDE BENCHMARK!!!")
   df = pd.read_excel(file_path)
   try:
        for i in range(3):
        #for i in range(len(df)):
            eth_address = df['Ethereum Contract Address'][i]
            #print(eth_address)
            eth_address = Web3.toChecksumAddress(eth_address)
            #print(eth_address)
            data = test_function_service(eth_address)
            #print(data)
            result_df = pd.DataFrame(data)
            
            #print(result_df)
            output_file_name = f"row_{i}_{eth_address}.xlsx" 
            #print(output_file_name) 
            output_file_path = os.path.join(current_dir, r'Scripts\utils\helpers\benchmarks\BenchmarkData', output_file_name)
            #print("Output to be saved: ", output_file_path)
            result_df.to_excel(output_file_path, index=False)
            print(f"Data saved to {output_file_path}")

        return {"status": "Benchmark completed successfully"}

   except Exception as e:
        return {"error": str(e)}
