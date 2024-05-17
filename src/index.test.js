const IBMDB2 = require('./index');

jest.mock('ibm_db', () => ({
  Database: jest.fn().mockImplementation(() => ({
    open: jest.fn((connectionString, callback) => {
      callback(null); // Simula conexão bem-sucedida
    }),
    queryResult: jest.fn((queryString, callback) => {
      if (queryString.includes('ERROR')) {
        callback(new Error('Query failed'), null); // Simula falha na consulta
      } else {
        callback(null, {
            fetchSync: jest.fn(() => null), // Simula resultados de consulta vazios
        });
      }
    }),
    closeSync: jest.fn(),
  })),
}));

describe('IBMDB2', () => {
  let db;

  beforeEach(() => {
    db = new IBMDB2(process.env.IBM_DATABASE, process.env.IBM_HOSTNAME, process.env.IBM_PORT, process.env.IBM_UID, process.env.IBM_PWD);
  });
  
  test('should connect to the database successfully', async () => {
    await expect(db.connect()).resolves.not.toThrow();
  });

  test('should query the database successfully', async () => {
    await db.connect();
    const data = await db.query("SELECT * FROM db2dba.clientela limit 5");
    console.log('Query Result:', data); // Imprime o resultado da consulta
    expect(data).toEqual([]); // Espera resultados vazios conforme simulação
    db.close();
  });

  test('should handle query errors', async () => {
    await db.connect();
    await expect(db.query('ERROR')).rejects.toThrow('Query failed');
    db.close();
  });

  test('should close the database connection', () => {
    db.close();
    expect(db.conn.closeSync).toHaveBeenCalled();
  });
});
