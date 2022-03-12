import psycopg2, os, json

tags_query = """
    SELECT b.id AS post_id, b.title, b.created_on, b.content, b.status, t.name AS tag_name, t.slug AS tag_slug, t.id AS tag_id
    FROM "blog_post" b 
        JOIN "blog_post_tags" bt ON b.id = bt.post_id
        JOIN "blog_tag" t ON bt.tag_id = t.id;
"""

def create_connection():
    # connect to pg db
    host = os.environ['HOST']
    port = "5432"
    dbname = os.environ['DB']
    user = os.environ['USER']
    pw = os.environ['PASSWORD']
    con = psycopg2.connect(
        host=host, 
        port=port, 
        dbname=dbname, 
        user=user, 
        password=pw, 
        gssencmode="disable"
        )

    return con

def make_dict(cursor):
    data = cursor.fetchall()
    columns = [i[0] for i in cursor.description]

    results = {}
    tags_idx = 0

    for post in data:
        results[post[0]] = {}
        results[post[0]]['tags'] = {}
        results[post[0]]['tags'][tags_idx] = {}

        for el, col in zip(post, columns):
            if 'tag_' in col:
                pass
            else:
                results[post[0]][col] = str(el)

    # next filter data for results dict key, built tags dict(s)
    ...

    results = json.dumps(results, indent=4)
    return results

def get_posts_tags():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute(tags_query)
    results = make_dict(cursor)
    print(results)
    conn.close()

    

