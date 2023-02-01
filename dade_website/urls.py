
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login),
    path('mdcps/', views.mdcps),
    path('grades/', views.grades),
    path('nogrades/', views.nogrades),
    path('coursegrades/', views.coursegrades),
]