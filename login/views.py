from django.shortcuts import render
from django.http import (
    HttpResponse,
    JsonResponse,
    HttpResponseBadRequest,
    HttpResponseRedirect,
    HttpResponsePermanentRedirect,
)
from django.contrib.auth import login
from django.contrib import messages
from rest_framework import views
import authlib
import secrets
import os
import secrets
import requests
import dotenv
import jwt
from .models import LoggedInUser
from .serialisers import LoginSerialiser
import threading
import time

AUTHORISE_URL = "https://github.com/login/oauth/authorize"
ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"
USER_API_URL = "https://api.github.com/user/"
EMAIL_API_URL = "https://api.github.com/user/emails"

session = requests.session()
state: str = secrets.token_urlsafe()


def update_state():
    global state
    while True:
        state = secrets.token_urlsafe()
        time.sleep(60 * 10)


state_update = threading.Thread(target=update_state, daemon=True)
state_update.start()


def handle_oauth() -> str:
    dotenv.read_dotenv()
    result = ""
    parameters = {
        "client_id": os.getenv("SECRET_CLIENT_ID_FOR_NOW"),
        "redirect_uri": "continue/",
        # "login": "",
        "scope": "user",
        "state": state,
    }
    get_response = session.get(AUTHORISE_URL, params=parameters)
    if (
        get_response.ok
        and get_response.json()["state"] == state
        and get_response.json()["code"]
    ):
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


# Create your views here.
class LoginAction(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request):
        try:
            dotenv.read_dotenv()
            result = ""
            parameters = {
                "client_id": os.getenv("SECRET_CLIENT_ID_FOR_NOW"),
                "redirect_uri": "http://localhost:8000/continue/",
                # "login": "",
                "scope": "user",
                "state": state,
            }
            get_response = session.get(AUTHORISE_URL, params=parameters)
            # return HttpResponsePermanentRedirect(get_response.url)
            return JsonResponse({"redirect": get_response.url})
        except:
            return HttpResponseBadRequest("Did something wrong.")

    def post(self, request):
        result = ""
        try:
            raise Exception
        except:
            return HttpResponseBadRequest("Did something wrong.")


class Continue(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request):
        result = "no"
        token = "no"
        access_token = "no"
        try:
            # if request.GET["state"] == state:
            #     print("it works this time though?")
            if request.GET["state"] == state and request.GET["code"]:
                github_code: str = request.GET["code"]
                header = {"Accept": "application/json"}
                post_body = {
                    "client_id": os.getenv("SECRET_CLIENT_ID_FOR_NOW"),
                    "client_secret": os.getenv("SECRET_CLIENT_SECRET"),
                    "code": github_code,
                    "redirect_uri": "http://localhost:8000/continue/",
                }
                post_response = session.post(
                    ACCESS_TOKEN_URL, data=post_body, headers=header
                )
                access_token = post_response.json()["access_token"]
                return HttpResponsePermanentRedirect(
                    f"http://localhost:3000/?pointlessToken={access_token}"
                )
            elif request.GET["error"]:
                return HttpResponseBadRequest(
                    f"""
                    <h1>{request.GET["error"] if request.GET["error"] else "Error"}</h1>
                    <p>{request.GET["error_description"] if request.GET["error_description"] else "Something happened"}</p>
                    <p>Please check the below for more information.</p>
                    <a src="{request.GET["error_uri"] if request.GET["error_uri"] else "https://google.com.au/"}">Link here</a>
                """
                )
            else:
                raise Exception
        except:
            return HttpResponseBadRequest("Did something wrong.")

    def post(self, request):
        result = "no"
        token = "no"
        try:
            if request.data["state"] == state and request.data["code"]:
                github_code: str = request.data["code"]
                post_body = {
                    "client_id": os.getenv("SECRET_CLIENT_ID_FOR_NOW"),
                    "client_secret": os.getenv("SECRET_CLIENT_SECRET"),
                    "code": github_code,
                    "redirect_uri": "http://localhost:8000/continue/",
                }
                post_response = session.post(ACCESS_TOKEN_URL, data=post_body)
                access_token = post_response.json()["access_token"]
                header = {
                    "Authorization": "token " + access_token,
                    "Accept": "application/vnd.github.v3+json",
                }
                return JsonResponse({"pointlessToken": token, "emails": result})
            else:
                raise Exception
        except:
            return HttpResponseBadRequest("Did something wrong.")


class LoggedIn(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request):
        return HttpResponse("Test")

    def post(self, request):
        result = "no"
        try:
            if request.data["access_token"]:
                access_token: str = request.data["access_token"]
                header = {
                    "Authorization": "token " + access_token,
                    "Accept": "application/vnd.github.v3+json",
                }
                email_response = session.get(USER_API_URL, headers=header)
                if email_response.ok and email_response.json()["email"]:
                    result = email_response.json()["email"]
                return JsonResponse({"email": result})
            else:
                raise Exception
        except:
            return HttpResponseBadRequest("Did something wrong.")


class SignUp(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request):
        return HttpResponse("Test")

    def post(self, request):
        try:
            serializer_class = LoginSerialiser
            queryset = LoggedInUser.objects.all()
            return JsonResponse({"result": "ok"})
        except:
            return HttpResponseBadRequest("Did something wrong.")


class GetEmail(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request):
        try:
            if request.headers["Authorization"]:
                header = {
                    "Authorization": request.headers["Authorization"],
                    "Accept": "application/vnd.github.v3+json",
                }
                email_response = session.get(USER_API_URL, headers=header)
                if email_response.ok and email_response.json()["email"]:
                    result = [email_response.json()["email"]]
                else:
                    time.sleep(1)
                    email_response = session.get(EMAIL_API_URL, headers=header)
                    result = email_response.json()
                return JsonResponse({"emails": result})
            else:
                raise Exception
        except:
            return HttpResponseBadRequest("Did something wrong.")

    def post(self, request):
        return HttpResponse("Test")


# Create your views here.
def index(request):
    return HttpResponse(
        "Hello, world. You shouldn't be looking here. If you are, I did not build this site."
    )
