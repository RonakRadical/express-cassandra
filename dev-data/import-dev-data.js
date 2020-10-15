const dotenv = require('dotenv');
const fs = require('fs');
const cassandra = require('cassandra-driver');

dotenv.config({ path: `${__dirname}/../config/dev.env` });

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// 將本地 json 檔案資料儲存到資料庫
const importData = async client => {
  try {
    const queries = [
      // {
      //   query: `INSERT INTO ${KEYSPACE_NAME}.${TABLE_NAME} (username, email, name, password) VALUES (?, ?, ?, ?)`,
      //   params: ['username1', 'username1@gmai.com', 'name1', 'password1']
      // }
    ];

    users.forEach(user => {
      queries.push({
        query: `INSERT INTO ${process.env.KEYSPACE_NAME}.${process.env.TABLE_NAME} (username, email, name, password) VALUES (?, ?, ?, ?)`,
        params: [user.username, user.email, user.name, user.password]
      });
    });

    await client.batch(queries, { prepare: true });

    console.log('本地測試資料已成功注入!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// 創建 keyspaces、table
const create = async () => {
  try {
    const client = new cassandra.Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1'
    });

    await client.connect((err, result) => {
      if (!err) return console.log(`${process.env.KEYSPACE_NAME} connected`);
      console.log(err);
    });

    const createKeyspace = `CREATE KEYSPACE ${process.env.KEYSPACE_NAME} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }`;
    await client.execute(createKeyspace, []);

    const createTable = `CREATE TABLE ${process.env.KEYSPACE_NAME}.${process.env.TABLE_NAME} (username text PRIMARY KEY, password text, email text, name text)`;
    await client.execute(createTable, []);

    importData(client);
  } catch (err) {
    console.log(err);
  }
};

/*
判斷 process.argv 執行腳本

創建 keyspaces 與 table, 注入本地 json 資料
node dev-data/data/import-dev-data.js --create
*/

if (process.argv[2] === '--create') create();
console.log(process.argv);
