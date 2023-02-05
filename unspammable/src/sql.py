import psycopg2, os, json

tags_query = """
    SELECT b.id AS post_id, b.title, b.created_on, b.content, b.status, b.slug AS blog_slug, t.name AS tag_name, t.slug AS tag_slug, t.id AS tag_id
    FROM "blog_post" b 
        JOIN "blog_post_tags" bt ON b.id = bt.post_id
        JOIN "blog_tag" t ON bt.tag_id = t.id;
"""

try:
    from dotenv import load_dotenv
    load_dotenv('../../unspammable/.env')
    host=os.getenv('HOST')
    port="5432"
    dbname=os.getenv('DB')
    user='ykycwabgufyanv'
    password=os.getenv('PASSWORD')

except ImportError:
    from django.conf import settings
    settings.configure()
    db = settings.DATABASES['default']
    host=db['HOST']
    port="5432"
    dbname=db['DB']
    user='ykycwabgufyanv'
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

def make_queryset(cursor):
    data = cursor.fetchall()
    columns = [i[0] for i in cursor.description]

    results = []
    tags = []

    for post in data:
        blog_post = {}
        tags_dict = {}
        for col, element in zip(columns, post):
            if col == 'post_id':
                tags_dict[col] = element
            if 'tag_' in col:
                tags_dict[col] = element
            else:
                blog_post[col] = element

        tags.append(tags_dict)
        results.append(blog_post) 

    # remove duplicates
    results = [i for n, i in enumerate(results) if i not in results[n + 1:]]

    # attach tags to corresponding posts
    for blog in results:
        blog['tags'] = []
        for tag in tags:
            if tag['post_id'] == blog['post_id']:
                blog['tags'].append(tag)

    return results

def get_posts_queryset():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute(tags_query)
    results = make_queryset(cursor)
    conn.close()

    return results

    

