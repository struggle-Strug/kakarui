from flask import request, jsonify

def delete_module_route(app):
    @app.route('/organizations/<organization_id>/modules', methods=['POST'])
    def module_add_url_create(organization_id):
        # リクエストヘッダーから認証情報を取得
        auth_header = request.headers.get('Authorization')
        content_type = request.headers.get('Content-Type')

        data = request.get_json()

        # 認証情報が無い場合、401エラーを返す
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "status_code": 401,
                "message": "Required credentials for the resource are missing or invalid."
            }), 401

        if content_type != 'application/json':
            return jsonify({
                "status_code": 400,
                "error": True,
                "error_code": "E40001",
                "message": "Invalid Content-Type. Expected application/json.",
                "description": "The Content-Type header must be application/json."
            }), 400

        
        if organization_id == '1':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50001",
                "message": "Internal Server Error",
                "description": "An unexpected error has occurred and the request cannot be processed."
            }), 500
        
        if organization_id == '2':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50013",
                "message": "Internal Server Error",
                "description": "Database operation failed: {sqlstate}"
            }), 500

        if organization_id == '3':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50014",
                "message": "Internal Server Error",
                "description": "External service operation failed: {errorstate}"
            }), 500
        # 正常系のレスポンス
        return jsonify({
            "status_code": 201,
            "message": "module add url create success."
        }), 200

    # メソッド違いやPATH不正に対して404を返すハンドラー
    @app.errorhandler(405)
    @app.errorhandler(404)
    def method_not_allowed(error):
        return jsonify({
            "status_code": 404,
            "error": True,
            "error_code": "E40401",
            "message": "Not Found",
            "description": "Resource not exist."
        }), 404

    # リクエストがJSONではないときに対して400を返すハンドラー
    @app.errorhandler(415)
    def invalid_json(error):
        return jsonify({
            "status_code": 400,
            "error": True,
            "error_code": "E40002",
            "message": "Invalid JSON Error",
            "description": "The provided JSON data is not valid.",
        }), 400
