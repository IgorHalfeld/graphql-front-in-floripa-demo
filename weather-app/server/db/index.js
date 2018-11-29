const { MongoClient } = require('mongodb')

const config = {
  url: 'mongodb://localhost:27017/graphql-demo',
  dbName: 'graphql-demo'
}

module.exports = () => new Promise((resolve, reject) => {
  MongoClient.connect(config.url, { useNewUrlParser: true }, (err, mongoConnection) =>
      err
      ? reject(err)
      : resolve({ client: mongoConnection.db(config.dbName), mongoConnection })
    );
});
