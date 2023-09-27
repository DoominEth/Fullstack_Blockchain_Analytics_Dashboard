# main.py
from flask import Flask
from api import api_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api') 

# Print URL map
#print("App Map: ",app.url_map)

if __name__ == "__main__":
    app.run(debug=True)
