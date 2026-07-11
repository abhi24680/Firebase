import socket
import psycopg2

# Force IPv4 resolution
orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4

try:
    conn = psycopg2.connect(
        "postgresql://postgres:Abhijith%40123@db.gturbyvxjbsmfbyqtbjy.supabase.co:5432/postgres",
        connect_timeout=10,
    )
    conn.autocommit = True
    cur = conn.cursor()

    tables = ['"User"', '"Attendance"', '"LeaveRequest"', '"Survey"']

    for table in tables:
        try:
            cur.execute(f'ALTER PUBLICATION supabase_realtime ADD TABLE {table};')
            print(f"Added {table} to realtime publication")
        except Exception as e:
            if "already exists" in str(e):
                print(f"{table} already in realtime publication")
            else:
                print(f"Error adding {table}: {e}")

    cur.close()
    conn.close()
    print("Done")
except Exception as e:
    print(f"Connection error: {e}")
