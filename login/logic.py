import secrets
import authlib
import requests
from ..oauth.settings import SECRET_CLIENT_ID_FOR_NOW

AUTHORISE_URL = "https://github.com/login/oauth/authorize"
EMAIL_API_URL = "https://api.github.com/user/emails"
def handle_oauth() -> str:
    parameters = {
        "client_id": SECRET_CLIENT_ID_FOR_NOW,
        "redirect_uri": "in/",
        # "login": "",
        # "scope": "",
        "state": secrets.token_urlsafe()
    }
    session = requests.session()
    response = session.get(AUTHORISE_URL, params=parameters)
    if response.json()["access_token"]:
        response = session.get(EMAIL_API_URL)
    return response.json()["email"]
