import psycopg2
import os

try:
    from dotenv import load_dotenv
    load_dotenv('../../unspammable/.env')
    host=os.getenv('HOST')
    port="5432"
    dbname=os.getenv('DB')
    user=os.getenv('USER')
    password=os.getenv('PASSWORD')

except ImportError:
    from django.conf import settings
    settings.configure()
    db = settings.DATABASES['default']
    host=db['HOST']
    port="5432"
    dbname=db['DB']
    user=db['USER']
    password=db['PASSWORD']

def create_connection():
    # connect to pg db
    con = psycopg2.connect(
        host=host, 
        port="5432", 
        dbname=dbname, 
        user=user, 
        password=password, 
        gssencmode="disable"
        )

    return con

def make_dict(result, columns):
    results = []
    for row in result:
        row_dict = {}
        for i, col in enumerate(columns):
            row_dict[col.name] = row[i]
        results.append(row_dict)
    return results

def movies_by_phase(phase):
    query = """
        SELECT title_text, url, platform_id, release_date, image
        FROM marvel_movie m
        WHERE m.phase_id = {}
        UNION
        SELECT title_text, url, platform_id, release_date, image
        FROM marvel_series s
        WHERE s.phase_id = {}
        ORDER BY release_date;
    """.format(phase + 1, phase + 1)
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    columns = list(cursor.description)
    results = cursor.fetchall()
    titles = make_dict(results, columns)

    conn.close()

    return titles

if __name__ == "__main__":
    print(movies_by_phase(phase=1))