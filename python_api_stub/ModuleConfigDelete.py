from flask import request, jsonify

def delete_module_config_route(app):
    @app.route('/organizations/<organization_id>/projects/<project_id>/module-configs/<module_config_id>', methods=['DELETE'])
    def delete_module_config(organization_id, project_id, module_config_id):
        # リクエストヘッダーから認証情報を取得
        auth_header = request.headers.get('Authorization')
        content_type = request.headers.get('Content-Type')

        print(f"project_idの値と型: {project_id}, 型: {type(project_id)}")
        print(f"module_config_idの値と型: {module_config_id}, 型: {type(module_config_id)}")

        # 認証情報が無い場合、401エラーを返す
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "status_code": 401,
                "message": "Required credentials for the resource are missing or invalid."
            }), 401

        # 各 project_id によるエラーハンドリング
        if module_config_id == '2':
            return jsonify({
                "status_code": 403,
                "error": True,
                "error_code": "E40301",
                "message": "Forbidden",
                "description": "Required permission for the resource are not exist."
            }), 403

        if module_config_id == '3':
            return jsonify({
                "status_code": 500,
                "error": True,
                "error_code": "E50001",
                "message": "Internal Server Error",
                "description": "An unexpected error has occurred and the request cannot be processed."
            }), 500

        if module_config_id == '4':
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
            "message": "ModuleConfig infomation delete success."
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
