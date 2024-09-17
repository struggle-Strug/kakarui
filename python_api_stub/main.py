from flask import Flask
from flask_cors import CORS
from ModuleDelete import delete_module_route
from ProjectDelete import delete_project_route
from UserDelete import delete_user_route
from PermissionDelete import delete_permission_route
from ModuleSetDelete import delete_module_set_route
from ModuleConfigDelete import delete_module_config_route

app = Flask(__name__)
# クロスオリジン用に設定
CORS(app)

# ProjectDeleteのエンドポイントを追加
delete_project_route(app)

# ModuleDeleteのエンドポイントを追加
delete_module_route(app)

# UserDeleteのエンドポイントを追加
delete_user_route(app)

# PermissionDeleteのエンドポイントを追加
delete_permission_route(app)

# ModuleSetDeleteのエンドポイントを追加
delete_module_set_route(app)

# ModuleConfigDeleteのエンドポイントを追加
delete_module_config_route(app)

if __name__ == '__main__':
    app.run(debug=True)
