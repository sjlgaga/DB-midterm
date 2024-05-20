# DB-midterm

## Prerequisite
1. python packages: pyodbc, flask, flask_cors
2. SQL Server
3. change your `conn_str` in function `get_db_connection()` in file `db_utils.py`

## Usage
1. run init_db.sql on SQL Server
2. `python server.py`
3. open `http://localhost/<port>` in browser
4. click the store can enter the order page