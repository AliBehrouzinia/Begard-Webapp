# from __future__ import unicode_literals
# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
#
# from .forms import BegardUserCreationForm, BegardUserChangeForm
# from .models import BegardUser
#
#
# class BegardUserAdmin(UserAdmin):
#     add_form = BegardUserCreationForm
#     form = BegardUserChangeForm
#     model = BegardUser
#     list_display = ('email')
#     list_filter = ('email')
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Permissions', {'fields': ('')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2')}
#         ),
#     )
#     search_fields = ('email',)
#     ordering = ('email',)
#
#
# admin.site.register(BegardUser, BegardUserAdmin)
