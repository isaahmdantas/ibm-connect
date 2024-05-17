import { Database } from 'ibm_db';
import { IDatabaseConfig } from '../src/types/IDatabaseConfig';
import { IQueryResult } from '../src/types/IQueryResult';

declare class IBMDB2 {
    private database: string;
    private hostname: string;
    private port: number;
    private uid: string;
    private pwd: string;
    private conn: Database;
    private connectionString: string;

    constructor(config: IDatabaseConfig);

    connect();

    query(queryString);

    close();
}

export { IBMDB2 };