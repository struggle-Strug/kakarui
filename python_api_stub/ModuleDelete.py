from flask import request, jsonify

def delete_module_route(app):
    @app.route('/organizations/<organization_id>/modules/<module_id>', methods=['DELETE'])
    def delete_module(organization_id, module_id):
        # リクエストヘッダーから認証情報を取得
        auth_header = request.headers.get('Authorization')
        content_type = request.headers.get('Content-Type')

        # リクエストボディからforced_delete_flagを取得
        data = request.get_json()
        forced_delete_flag = data.get('forced_delete_flag', False)
        print(f"forced_delete_flagの値: {forced_delete_flag}")
        print(f"module_idの値と型: {module_id}, 型: {type(module_id)}")

        # 認証情報が無い場合、401エラーを返す
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "status_code": 401,
                "message": "Required credentials for the resource are missing or invalid."
            }), 401

        # 各 module_id によるエラーハンドリング
        if module_id == '2':
            return jsonify({
                "status_code": 403,
                "error": True,
                "error_code": "E40301",
                "message": "Forbidden",
                "description": "Required permission for the resource are not exist."
            }), 403

        if module_id == '3':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50001",
                "message": "Internal Server Error",
                "description": "An unexpected error has occurred and the request cannot be processed."
            }), 500

        if module_id == '4':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50013",
                "message": "Internal Server Error",
                "description": "Database operation failed: {sqlstate}"
            }), 500

        if module_id == '5':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50014",
                "message": "Internal Server Error",
                "description": "External service operation failed: {errorstate}"
            }), 500

        # module_idが1で、forced_delete_flagがFalseの場合のエラーレスポンス
        if module_id == '1' and not forced_delete_flag:
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50026",
                "message": "Deletion not permitted",
                "description": "The module is currently in use and cannot be deleted. To force deletion, please set the forced_delete_flag to true."
            }), 500

        # 正常系のレスポンス
        return jsonify({
            "status_code": 200,
            "message": "Module delete success."
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
