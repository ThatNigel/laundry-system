from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class Service(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  duration_hours = models.IntegerField(help_text="Duration in hours")
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.name


class Customer(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  phone = models.CharField(max_length=15)
  address = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.user.first_name} {self.user.last_name}"


class Order(models.Model):
  STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('in_progress', 'In Progress'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
  ]

  customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
  service = models.ForeignKey(Service, on_delete=models.CASCADE)
  quantity = models.IntegerField(default=1)
  total_amount = models.DecimalField(max_digits=10, decimal_places=2)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
  pickup_date = models.DateTimeField()
  delivery_date = models.DateTimeField()
  special_instructions = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"Order #{self.id} - {self.customer}"

  def save(self, *args, **kwargs):
    self.total_amount = self.service.price * self.quantity
    super().save(*args, **kwargs)
