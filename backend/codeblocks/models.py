from django.db import models

class Codeblock(models.Model):
    title = models.CharField(max_length=20,unique=True)
    template = models.TextField(max_length=60)
    solution = models.TextField(max_length=60)
    Content = models.TextField(max_length=200)
    is_solved = models.BooleanField(default=False)
    level = models.IntegerField()

    def __str__(self):
        return self.title


