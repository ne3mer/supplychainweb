from ethicsupply.wsgi import application

# This allows Vercel to use the Django WSGI application
def handler(request, *args, **kwargs):
    return application(request, *args, **kwargs) 