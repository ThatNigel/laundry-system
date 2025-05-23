from django.db import models

# Create your models here.

class Customers(models.Model):
  category = models.CharField(max_length=150, default='True')
  Name = models.CharField(max_length=200)
  Email = models.CharField(max_length=150)
  Phone = models.CharField(max_length=15)
  Address = models.CharField(max_length=250)
  Actions = models.CharField(max_length=250)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateField(auto_now=True)

  def __str__(self):
    return self.fullname


class Orders(models.Model):
  category = models.CharField(max_length=150, default='True')
  Customer = models.CharField(max_length=200)
  Service= models.CharField(max_length=150)
  Quantity = models.CharField(max_length=15)
  TotalPrice = models.CharField(max_length=150, default='True')
  Status= models.CharField(max_length=150, default='True')
  OrderDate = models.CharField(max_length=250)
  Actions = models.CharField(max_length=250)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateField(auto_now=True)

  def __str__(self):
    return self.orders

class Services(models.Model):
  category = models.CharField(max_length=150, default='True')
  SeeviceName = models.CharField(max_length=200)
  Price= models.CharField(max_length=150)
  Duration = models.CharField(max_length=15)
  Description = models.CharField(max_length=150, default='True')
  Actions = models.CharField(max_length=250)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateField(auto_now=True)

  def __str__(self):
    return self.services

