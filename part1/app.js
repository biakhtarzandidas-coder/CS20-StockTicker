const fs = require('fs');
const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://bijanad_db_user:123@cluster0.zuzzc47.mongodb.net/?appName=Cluster0';

const fileStream = fs.createReadStream('companies-1.csv');
const rl = readline.createInterface({ input: fileStream });

let isFirstLine = true;

MongoClient.connect(url, function(err, db) {
  if (err) { console.log(err); return; }
  console.log('Connected to MongoDB');

  const dbo = db.db('Stock');
  const collection = dbo.collection('PublicCompanies');

  rl.on('line', function(line) {
    if (isFirstLine) { isFirstLine = false; return; }

    const parts = line.split(',');
    const price = parseFloat(parts[parts.length - 1]);
    const ticker = parts[parts.length - 2];
    const company = parts.slice(0, parts.length - 2).join(',');

    const doc = { company: company, ticker: ticker, price: price };
    console.log('Inserting:', doc);

    collection.insertOne(doc, function(err, res) {
      if (err) throw err;
      console.log('Inserted: ' + doc.company);
    });
  });

  rl.on('close', function() {
    console.log('Done! All companies inserted.');
  });
});