
from django.urls import path
from . import views

urlpatterns = [
    path('', views.send_to_home),
    path('home/', views.home),
    path('login/', views.login),
    path('mdcps/', views.mdcps),
    path('grades/', views.grades),
    path('nogrades/', views.nogrades),
    path('coursegrades/', views.coursegrades),
    path('node_package/', views.node_package)
]