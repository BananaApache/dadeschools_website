from django.shortcuts import render

# Create your views here.


def login(request):
    return render(request, "login.html")


def mdcps(request):
    return render(request, "mdcps.html")


def coursegrades(request):
    return render(request, "coursegrades.html")


def grades(request):
    return render(request, "grades.html")


def nogrades(request):
    return render(request, "nogrades.html")

