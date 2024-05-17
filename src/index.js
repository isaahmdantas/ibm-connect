const ibmdb = require('ibm_db');

class IBMDB2 {
    constructor(database, hostname, port, uid, pwd) {
        this.database = database;
        this.hostname = hostname;
        this.port = port;
        this.uid = uid;
        this.pwd = pwd;

        this.conn = new ibmdb.Database();
        this.connectionString = `database=${this.database};hostname=${this.hostname};port=${this.port};uid=${this.uid};pwd=${this.pwd};PROTOCOL=TCPIP`
    }

    async connect() {
        return new Promise((resolve, reject) => {
          this.conn.open(this.connectionString, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
    }

    async query(queryString) {
        return new Promise((resolve, reject) => {
          this.conn.queryResult(queryString, (err, result) => {
            if (err) {
              reject(err);
            } else {
              let data = [];
              let row;

              while ((row = result.fetchSync())) {
                data.push(row);
              }

              resolve(data);
            }
          });
        });
    }
    
    close() {
        this.conn.closeSync();
    }
}

module.exports = IBMDB2