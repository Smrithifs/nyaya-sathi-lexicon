import os
import pathlib
import json
import dotenv
from fastapi import FastAPI, APIRouter, Depends

dotenv.load_dotenv()

from databutton_app.mw.auth_mw import AuthConfig, get_authorized_user

# Change this to the actual path where your routes are located
ROUTES_PACKAGE_NAME = "routes"  # e.g., backend/routes/*.py

def get_router_config() -> dict:
    try:
        with open("routers.json") as f:
            cfg = json.load(f)
        return cfg
    except Exception as e:
        print("Router config load failed:", e)
        return {}

def is_auth_disabled(router_config: dict, name: str) -> bool:
    return router_config.get("routers", {}).get(name, {}).get("disableAuth", False)

def import_api_routers() -> APIRouter:
    routes = APIRouter(prefix="/routes")
    router_config = get_router_config()

    src_path = pathlib.Path(__file__).parent
    routes_path = src_path / ROUTES_PACKAGE_NAME

    if not routes_path.exists():
        print("❌ Routes folder not found:", routes_path)
        return routes

    for file in routes_path.glob("*.py"):
        if file.name.startswith("_"):
            continue

        module_name = file.stem
        full_import_path = f"{ROUTES_PACKAGE_NAME}.{module_name}"
        print(f"🔁 Importing route: {full_import_path}")

        try:
            module = __import__(full_import_path, fromlist=["router"])
            api_router = getattr(module, "router", None)

            if isinstance(api_router, APIRouter):
                routes.include_router(
                    api_router,
                    dependencies=[] if is_auth_disabled(router_config, module_name)
                    else [Depends(get_authorized_user)]
                )
        except Exception as e:
            print(f"⚠️ Error importing {full_import_path}: {e}")
            continue

    return routes

def get_firebase_config() -> dict | None:
    extensions = os.environ.get("DATABUTTON_EXTENSIONS", "[]")
    try:
        extensions = json.loads(extensions)
    except:
        extensions = []

    for ext in extensions:
        if ext["name"] == "firebase-auth":
            return ext["config"]["firebaseConfig"]

    return None

def create_app() -> FastAPI:
    app = FastAPI()

    @app.get("/")
    def root():
        return {"message": "LegalOps Backend running ✅"}

    app.include_router(import_api_routers())

    firebase_config = get_firebase_config()

    if firebase_config:
        print("✅ Firebase config found")
        auth_config = {
            "jwks_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
            "audience": firebase_config["projectId"],
            "header": "authorization",
        }
        app.state.auth_config = AuthConfig(**auth_config)
    else:
        print("⚠️ No firebase config found")
        app.state.auth_config = None

    return app

app = create_app()
