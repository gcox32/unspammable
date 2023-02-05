from unspammable.src.sql import *

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