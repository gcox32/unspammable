from marvel.models import Platform, Credential

def get_platforms_credentials(request):
    """helper function for loading in creds"""
    platforms = Platform.objects.values()
    try:
        credentials = Credential.objects.filter(user_id=request.user.id).values_list()
        credentials = list(credentials)
    except:
        credentials = [None]
    context = {
        'platforms': platforms,
        'credentials': credentials,
    }
    return context