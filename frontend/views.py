from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from . import models

def main(request):
    return render(request, 'index.html')

def predict(request):
    predictions = models.predict(request)

    return predictions

def ad(request):
    return HttpResponse('success')