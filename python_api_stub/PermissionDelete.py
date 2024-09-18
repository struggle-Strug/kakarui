from flask import request, jsonify

def delete_permission_route(app):
    @app.route('/organization/<organization_id>/users/<user_id>/permission', methods=['DELETE'])
    def delete_permission(organization_id, user_id):
        # リクエストヘッダーから認証情報を取得
        auth_header = request.headers.get('Authorization')
        content_type = request.headers.get('Content-Type')

        print(f"user_idの値と型: {user_id}, 型: {type(user_id)}")

        # 認証情報が無い場合、401エラーを返す
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "status_code": 401,
                "message": "Required credentials for the resource are missing or invalid."
            }), 401

        # 各 entra_id によるエラーハンドリング
        if user_id == '2':
            return jsonify({
                "status_code": 403,
                "error": True,
                "error_code": "E40301",
                "message": "Forbidden",
                "description": "Required permission for the resource are not exist."
            }), 403

        if user_id == '3':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50001",
                "message": "Internal Server Error",
                "description": "An unexpected error has occurred and the request cannot be processed."
            }), 500

        if user_id == '4':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50013",
                "message": "Internal Server Error",
                "description": "Database operation failed: {sqlstate}"
            }), 500

        # 正常系のレスポンス
        return jsonify({
            "status_code": 200,
            "message": "Permission delete success."
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
