# Step 2: Create app.py - Main Flask Application

from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Load OWASP data
def load_owasp_data():
    with open('data/owasp_data.json', 'r') as file:
        return json.load(file)

@app.route('/')
def dashboard():
    data = load_owasp_data()
    return render_template('dashboard.html', vulnerabilities=data['owasp_top_10'])

@app.route('/vulnerability/<vuln_id>')
def vulnerability_detail(vuln_id):
    data = load_owasp_data()
    
    # Find the specific vulnerability
    vulnerability = None
    for vuln in data['owasp_top_10']:
        if vuln['id'] == vuln_id:
            vulnerability = vuln
            break
    
    if vulnerability:
        return render_template('vulnerability.html', vulnerability=vulnerability)
    else:
        return "Vulnerability not found", 404

@app.route('/api/vulnerabilities')
def api_vulnerabilities():
    data = load_owasp_data()
    return jsonify(data)

@app.route('/api/vulnerability/<vuln_id>')
def api_vulnerability(vuln_id):
    data = load_owasp_data()
    
    # Find the specific vulnerability
    for vuln in data['owasp_top_10']:
        if vuln['id'] == vuln_id:
            return jsonify(vuln)
    
    return jsonify({"error": "Vulnerability not found"}), 404

if __name__ == '__main__':
    # Ensure the data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Create the data file if it doesn't exist
    if not os.path.exists('data/owasp_data.json'):
        # This is just for development - in production, you'd want to have your data prepared
        print("Warning: data/owasp_data.json not found. Please create it with valid OWASP data.")
        
    app.run(debug=True)
