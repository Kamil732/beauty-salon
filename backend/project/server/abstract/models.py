from django.db import models


class Color(models.Model):
    COLORS = (
        ('black', 'Czarny'),
        ('light-blue', 'Jasny niebieski'),
        ('blue', 'Niebieski'),
        ('light-green', 'Jasny Zielony'),
        ('green', 'Zielony'),
        ('pink', 'Różowy'),
        ('purple', 'Fioletowy'),
        ('brown', 'Brązowy'),
        ('yellow', 'Żółty'),
        ('orange', 'Pomarańczowy'),
    )

    color = models.CharField(max_length=15, choices=COLORS, default=COLORS[0][1])

    class Meta:
        abstract = True


class Group(models.Model):
    name = models.CharField(max_length=30, unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='children')

    def __str__(self):
        full_path = [self.name]
        k = self.parent

        while k is not None:
            full_path.append(k.name)
            k = k.parent

        return ' -> '.join(full_path[::-1])

    class Meta:
        abstract = True
