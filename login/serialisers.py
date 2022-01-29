from rest_framework import serializers
from .models import LoggedInUser

class LoginSerialiser(serializers.ModelSerializer):
    class Meta:
        model = LoggedInUser
        fields = ('id', 'oauth', 'email_address', 'hashed')
