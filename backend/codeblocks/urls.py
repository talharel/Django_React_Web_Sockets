from django.urls import path
from .views import get_codeblocks,get_codeblock_by_id


urlpatterns = [
    path('',get_codeblocks),
    path('<int:id>/',get_codeblock_by_id)
]