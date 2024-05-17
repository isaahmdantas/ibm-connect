import { Database } from 'ibm_db';
import { IDatabaseConfig } from 'IDatabaseConfig';
import { IQueryResult } from 'IQueryResult';

class IBMDB2 {
    private database: string;
    private hostname: string;
    private port: number;
    private uid: string;
    private pwd: string;
    private conn: Database;
    private connectionString: string;

    constructor(config: IDatabaseConfig) {
        this.database = config.database;
        this.hostname = config.hostname;
        this.port = config.port;
        this.uid = config.uid;
        this.pwd = config.pwd;

        this.conn = new Database();
        this.connectionString = `database=${this.database};hostname=${this.hostname};port=${this.port};uid=${this.uid};pwd=${this.pwd};PROTOCOL=TCPIP`;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.conn.open(this.connectionString, (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async query(queryString: string): Promise<IQueryResult[]> {
        return new Promise((resolve, reject) => {
            this.conn.queryResult(queryString, (err: Error | null, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    let data: IQueryResult[] = [];
                    let row;

                    while ((row = result.fetchSync())) {
                        data.push(row);
                    }

                    resolve(data);
                }
            });
        });
    }

    close(): void {
        this.conn.closeSync();
    }
}

export default IBMDB2;
