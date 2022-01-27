from django.contrib import admin
from .models import LoggedInUser

# Register your models here.
# class LoggedInUserAdmin(admin.ModelAdmin):
#     list_display = ('oauth', 'email_address')

admin.site.register(LoggedInUser)
