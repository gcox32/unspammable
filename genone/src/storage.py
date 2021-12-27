from django.core.files.storage import FileSystemStorage

class SaveStateStorage(FileSystemStorage):
    
    def get_available_name(self, name, max_length=50):
        """overwrite default of creating new filename"""
        return name