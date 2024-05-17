import pyodbc

# 你的连接字符串
conn_str = (
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=localhost,1433;"
    "Database=TestDB;"
    "UID=sa;"
    "PWD=Byron123000;"
    "TrustServerCertificate=yes;"
)

conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

# 创建一个新表
cursor.execute('''
CREATE TABLE TestTable (
    Id INT PRIMARY KEY,
    Name NVARCHAR(50)
)
''')
conn.commit()

# 插入数据
cursor.execute("INSERT INTO TestTable (Id, Name) VALUES (1, 'TestName')")
conn.commit()

# 查询数据
cursor.execute("SELECT * FROM TestTable")
for row in cursor:
    print(row)

# 关闭连接
cursor.close()
conn.close()