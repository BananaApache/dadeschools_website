from django.shortcuts import render, redirect

# Create your views here.


def home(request):
    return render(request, "home.html")


def send_to_home():
    return redirect(home)


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


def node_package(request):
    return render(request, "node_package.html")



def grade_calculator(request):
    return render(request, "grade_calculator.html")


def error(request):
    return render(request, "error.html")
