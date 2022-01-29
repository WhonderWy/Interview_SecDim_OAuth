import email
import os
import secrets
import authlib
import requests
import dotenv

AUTHORISE_URL = "https://github.com/login/oauth/authorize"
ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"
USER_API_URL = "https://api.github.com/user/"

def handle_oauth() -> str | None:
    dotenv.read_dotenv()
    result = None
    state: str = secrets.token_urlsafe()
    parameters = {
        "client_id": os.getenv("SECRET_CLIENT_ID_FOR_NOW"),
        # "redirect_uri": "continue/",
        # "login": "",
        # "scope": "",
        "state": state,
    }
    session = requests.session()
    get_response = session.get(AUTHORISE_URL, params=parameters)
    if get_response.ok and get_response.json()["code"]:
        github_code: str = get_response.json()["code"]
        post_body = {
            "client_id": os.getenv("SECRET_CLIENT_ID_FOR_NOW"),
            "client_secret": os.getenv("SECRET_CLIENT_SECRET"),
            "code": github_code,
            "redirect_uri": "/",
        }
        post_response = session.post(ACCESS_TOKEN_URL, data=post_body)
        if post_response.ok and post_response.json()["access_token"]:
            access_token: str = post_response.json()["access_token"]
            header = {
                "Authorization": "token " + access_token,
                "Accept": "application/vnd.github.v3+json",
            }
            email_response = session.get(USER_API_URL, headers=header)
            if email_response.ok and email_response.json()["email"]:
                result = email_response.json()["email"]
    return result
