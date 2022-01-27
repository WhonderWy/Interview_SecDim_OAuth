from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from rest_framework import views
import authlib
from .logic import handle_oauth

# Create your views here.
class LoginAction(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []
    
    def get(self, request):
        return HttpResponse("Test")

    def post(self, request):
        result: str = ""
        try:
            if request.data["oauth"]:
                result = handle_oauth()
            else:
                email: str = request.data["email"]
                password: str = request.data["password"]
            return JsonResponse({"result": result})
        except:
            return HttpResponseBadRequest("Did something wrong.")

class LoggedIn(views.APIView):
    @classmethod
    def get_extra_actions(cls):
        return []
    
    def get(self, request):
        return HttpResponse("Test")

    def post(self, request):
        try:
            
            return JsonResponse({"result": str(result)})
        except:
            return HttpResponseBadRequest("Did something wrong.")


# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You shouldn't be looking here. If you are, I did not build this site.")
