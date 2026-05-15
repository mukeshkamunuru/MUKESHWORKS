from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import JoiningID
from .serializers import RegisterSerializer, UserSerializer, JoiningIDSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid():
            return Response(UserSerializer(s.save()).data, status=201)
        return Response(s.errors, status=400)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


def build_id(full_name, department, year):
    dept      = department[:3].upper()
    initials  = ''.join(w[0] for w in full_name.strip().split()).upper()
    return f'NW-{dept}-{year}-{initials}'

def unique_id(base):
    if not JoiningID.objects.filter(joining_id=base).exists():
        return base
    n = 2
    while True:
        candidate = f'{base}-{n:02d}'
        if not JoiningID.objects.filter(joining_id=candidate).exists():
            return candidate
        n += 1


class JoiningIDListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(JoiningIDSerializer(JoiningID.objects.all(), many=True).data)

    def post(self, request):
        name  = request.data.get('full_name', '').strip()
        dept  = request.data.get('department', '').strip()
        year  = request.data.get('year', '').strip()

        errors = {}
        if not name:          errors['full_name']   = 'Required.'
        if len(dept) < 3:     errors['department']  = 'Min 3 characters.'
        if not year.isdigit() or len(year) != 4:
                              errors['year']        = '4-digit year required.'
        if errors:
            return Response(errors, status=400)

        jid = unique_id(build_id(name, dept, year))
        rec = JoiningID.objects.create(full_name=name, department=dept, year=year, joining_id=jid, created_by=request.user)
        return Response(JoiningIDSerializer(rec).data, status=201)


class JoiningIDDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            JoiningID.objects.get(pk=pk).delete()
            return Response({'message': 'Deleted.'})
        except JoiningID.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)
