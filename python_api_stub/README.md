
# Flask Application Setup Guide

## Windows Setup

### 1. Python Installation
1. Access the official Python website and download the latest version of Python.
2. Run the downloaded installer and ensure you check "Add Python to PATH" before clicking "Install Now."
3. After installation, open the command prompt (Windows + R → type `cmd` → press Enter) or PowerShell, and execute the following command to verify that Python is installed correctly:
   ```bash
   $ python --version
   ```

### 2. Creating a Virtual Environment
1. Create a project directory. For example, move to `C:\Users\<Username>\flask_project` and create the directory:
   ```bash
   $ mkdir flask_project
   $ cd flask_project
   ```
2. Create a virtual environment:
   ```bash
   $ python -m venv venv
   ```
3. Activate the virtual environment:
   ```bash
   $ venv\Scripts\activate
   ```
4. Install the necessary modules:
   ```bash
   $ pip install requests
   $ pip install Flask
   ```

### 3. Flask Application Creation
**(Skip this step if already created)**

Create a Flask application:
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/organizations/<organization_id>/modules/<module_id>', methods=['DELETE'])
def delete_module(organization_id, module_id):
    auth_header = request.headers.get('Authorization')
    content_type = request.headers.get('Content-Type')

    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({
            "status_code": 401,
            "error": True,
            "error_code": "E40101",
            "message": "Required credentials for the resource are missing or invalid.",
            "description": "Authorization token is missing or invalid."
        }), 401

    if content_type != 'application/json':
        return jsonify({
            "status_code": 400,
            "error": True,
            "error_code": "E40001",
            "message": "Invalid Content-Type. Expected application/json.",
            "description": "The Content-Type header must be application/json."
        }), 400
    return jsonify({
        "status_code": 200,
        "message": "Module delete success."
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
```

### 4. Running the Flask Application
1. To start the Flask application, run the following command in the command prompt:
   ```bash
   $ python main.py
   ```
   - The `main.py` file contains the code to access each stub.
2. For non-GET requests, use tools like Postman or Talend API to send requests. Example:
   ```
   http://127.0.0.1:5000/organizations/1111/modules/2222
   ```
   **Note**: This module requires the `Authorization Bearer` header; otherwise, it will return an error.
3. After testing, deactivate the virtual environment:
   ```bash
   $ deactivate
   ```

## Mac Setup

### 1. Python Installation
1. Download the latest version of Python from the official Python website.
2. Open the downloaded `.pkg` file and follow the installation wizard.
3. After installation, open Terminal (Finder → Applications → Utilities → Terminal), and run the following command to verify that Python is installed:
   ```bash
   $ python3 --version
   ```

4. Activate the virtual environment:
   ```bash
   $ source venv/bin/activate
   ```

Continue following the Windows setup from step 2 onwards. 
Please replace any instance of `python` with `python3` for Mac.

## Single Test Preparation (Front-End)
```javascript
const response = await Axios.delete(
  buildApiURL(API.MODULE.DELETE, { organization_id: organizationId, module_id: moduleId }),
  {
    data: { forced_delete_flag: true },
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1800000,
  }
);
```
Replace:
```javascript
buildApiURL(API.MODULE.DELETE, { organization_id: organizationId, module_id: moduleId })
```
with:
```
http://127.0.0.1:5000/organizations/111/modules/222
```

## Notes:
- Error control is managed through URL parameters.
- Error handling is in place for unexpected methods or resources, so please ensure correct errors are returned.
