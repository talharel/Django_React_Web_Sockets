from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Codeblock
from .serializers import CodeblockSerializer

@api_view(['GET'])
def get_codeblocks(request):
    try:
        codeblocks = Codeblock.objects.all()
        if codeblocks.exists():
            serializer = CodeblockSerializer(codeblocks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No codeblocks found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def get_codeblock_by_id(request,id):
    try:
        codeblock = Codeblock.objects.get(id=id)        
    except Codeblock.DoesNotExist:
        return Response({'error': 'Codeblock not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    serializer = CodeblockSerializer(codeblock)
    return Response(serializer.data, status=status.HTTP_200_OK)