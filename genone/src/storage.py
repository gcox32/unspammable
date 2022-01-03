from django.core.files.storage import FileSystemStorage

class SaveStateStorage(FileSystemStorage):
    
    def get_available_name(self, name, max_length=50):
        """overwrite default of creating new filename"""
        return name

def read_file(filename):
    with open(filename) as f:
        contents = f.read()
    return contents

def write_file(f, filename):
    with open(filename, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
            
def handle_uploaded_file(f, filename):
    write_file(f, filename) 
    contents = read_file(filename)
    return contents
