// part1.js
// Reads companies.csv line by line and inserts into MongoDB

var fs = require('fs');
var readline = require('readline');
var mongo = require('mongodb');

var MongoClient = mongo.MongoClient;

// put your connection string here
var url = "mongodb+srv://bijanad_db_user:123@cluster0.zuzzc47.mongodb.net/?appName=Cluster0";

MongoClient.connect(url, function(err, client) {

    if (err) {
        console.log("Connection error: " + err);
        return;
    }

    console.log("Connected to MongoDB");

    var db = client.db("Stock");
    var collection = db.collection("PublicCompanies");

    // create readline interface to read file line by line
    var rl = readline.createInterface({
        input: fs.createReadStream('companies-1.csv')
    });

    var count = 0;
    var firstLine = true;

    // read each line of the file
    rl.on('line', function(line) {

        // skip header row
        if (firstLine) {
            firstLine = false;
            return;
        }

        console.log(line);

        var parts = line.split(',');

        var companyName = parts[0];
        var ticker = parts[1];
        var price = parseFloat(parts[2]);

        var newDoc = {
            name: companyName,
            ticker: ticker,
            price: price
        };

        count++;

        collection.insertOne(newDoc, function(err, res) {
            if (err) {
                console.log("Insert error: " + err);
            } else {
                console.log("Inserted: " + companyName);
            }

            count--;

            if (count === 0) {
                console.log("Finished inserting all documents");
                client.close();
            }
        });

    });

});