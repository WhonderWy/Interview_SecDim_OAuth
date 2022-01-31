from django.urls import path, include

"""oauth URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from .views import GetEmail, LoginAction, Continue, SignUp, LoggedIn, index

# urlpatterns = [
#     path('', views.index, name='index'),
#     path('login/', views.LoginAction.as_view()),
#     path('continue/', views.Continue.as_view()),
#     path('signup/', views.SignUp.as_view()),
#     path('in/', views.LoggedIn.as_view()),
# ]

urlpatterns = [
    path("", index, name="index"),
    path("login/", LoginAction.as_view()),
    path("continue/", Continue.as_view()),
    path("signup/", SignUp.as_view()),
    path("in/", LoggedIn.as_view()),
    path("emails/", GetEmail.as_view()),
]
