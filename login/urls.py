from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.LoginAction.as_view()),
    path('continue/', views.Continue.as_view()),
    path('signup/', views.SignUp.as_view()),
    path('in/', views.LoggedIn.as_view()),
]