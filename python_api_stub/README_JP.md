
# Flaskアプリケーションセットアップガイド

## Windows版

### 1. Pythonのインストール
1. Python公式サイトにアクセスして、最新バージョンのPythonをダウンロードします。
2. ダウンロードしたインストーラーを実行し、「Add Python to PATH」にチェックを入れてから「Install Now」をクリックします。
3. インストールが完了したら、コマンドプロンプト（Windows + R → cmd → Enter）またはPowerShellを開き、以下のコマンドを実行してPythonが正しくインストールされていることを確認します。
   ```bash
   $ python --version
   ```

### 2. 仮想環境の作成
1. プロジェクト用のディレクトリを作成します。例として、`C:\Users\<ユーザー名>\flask_project`に移動してディレクトリを作成します。
   ```bash
   $ mkdir flask_project
   $ cd flask_project
   ```
2. 仮想環境を作成します:
   ```bash
   $ python -m venv venv
   ```
3. 仮想環境を有効にします:
   ```bash
   $ venv\Scripts\activate
   ```
4. 必要なモジュールをインストールします:
   ```bash
   $ pip install requests
   $ pip install Flask
   ```

### 3. Flaskアプリケーションの作成
**(既に作成済みの場合はこの手順をスキップ)**

Flaskアプリケーションを作成します:
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

### 4. Flaskアプリケーションの実行
1. Flaskアプリケーションを起動するために、コマンドプロンプトで以下のコマンドを実行します:
   ```bash
   $ python main.py
   ```
   - `main.py` ファイルには各スタブへのアクセスコードが含まれています。
2. GET以外のリクエストにはPostmanやTalend APIを使用してリクエストを送信します。例:
   ```
   http://127.0.0.1:5000/organizations/1111/modules/2222
   ```
   **注**: このモジュールでは `Authorization Bearer` ヘッダーを含めないとエラーになります。
3. テストが終了したら仮想環境を終了します:
   ```bash
   $ deactivate
   ```

## Mac版

### 1. Pythonのインストール
1. Python公式サイトから最新バージョンのPythonをダウンロードします。
2. ダウンロードした `.pkg` ファイルを開き、インストールウィザードに従ってインストールします。
3. インストール後、ターミナルを開き（Finder → アプリケーション → ユーティリティ → ターミナル）、以下のコマンドを実行してPythonが正しくインストールされているか確認します。
   ```bash
   $ python3 --version
   ```

4. 仮想環境を有効にします:
   ```bash
   $ source venv/bin/activate
   ```

以降はWindows版の手順2以降に従ってください。
**注**: Macでは `python` を `python3` に置き換えてください。

## 単体試験準備（フロントエンド）
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
以下に置き換えます:
```javascript
buildApiURL(API.MODULE.DELETE, { organization_id: organizationId, module_id: moduleId })
```
を:
```
http://127.0.0.1:5000/organizations/111/modules/222
```

## 備考:
- URLのパラメータでエラーの制御を行っています。
- 想定外のメソッドやリソースにアクセスした場合のエラーハンドリングが含まれているため、エラーが正しく返されることを確認してください。
