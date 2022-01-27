from django.db import models

# Create your models here.
class LoggedInUser(models.Model):
    oauth: models.BooleanField = models.BooleanField()
    email_address: models.EmailField = models.EmailField()
    hashed: models.CharField = models.CharField(max_length=350)

    def __str__(self):
        return self.email_address
