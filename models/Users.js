const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST],
  localDataCenter: 'datacenter1',
  keyspace: process.env.KEYSPACE_NAME
});

client.connect((err, result) => {
  if (!err) return console.log('testcassandra connected');
  console.log(err);
});

module.exports = { client, table: process.env.TABLE_NAME };
