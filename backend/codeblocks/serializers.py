from rest_framework import serializers
from .models import Codeblock

class CodeblockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Codeblock
        fields = '__all__'








