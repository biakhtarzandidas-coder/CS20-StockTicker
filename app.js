// app.js
// Stock Ticker Web App

var http = require('http');
var url = require('url');
var mongo = require('mongodb');

var MongoClient = mongo.MongoClient;

var port = process.env.PORT || 3000;

console.log("Server Running on port " + port);

// your MongoDB connection string
var uri = "mongodb+srv://bijanad_db_user:123@cluster0.zuzzc47.mongodb.net/?appName=Cluster0";

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});

    var urlObj = url.parse(req.url, true);

    /* HOME PAGE */
    if (urlObj.pathname == "/") {

        res.write("<h2>Stock Search App</h2>");

        var form = "<form method='get' action='/process'>" +
                   "Enter company or ticker: <input type='text' name='search'><br><br>" +

                   "<input type='radio' name='type' value='company' checked> Company" +
                   "<input type='radio' name='type' value='ticker'> Ticker<br><br>" +

                   "<input type='submit'>" +
                   "</form>";

        res.write(form);
        res.end();
    }

    /* PROCESS PAGE */
    else if (urlObj.pathname == "/process") {

        var search = urlObj.query.search;
        var type = urlObj.query.type;

        MongoClient.connect(uri, function(err, client) {

            if (err) {
                res.write("Database connection error");
                res.end();
                return;
            }

            var db = client.db("Stock");
            var collection = db.collection("PublicCompanies");

            var query;

            // determine search type
            if (type == "company") {
                query = { name: search };
            } else {
                query = { ticker: search };
            }

            collection.find(query).toArray(function(err, results) {

                if (err) {
                    res.write("Query error");
                    res.end();
                    return;
                }

                res.write("<h2>Results:</h2>");

                if (results.length == 0) {
                    res.write("No results found");
                } else {

                    for (var i = 0; i < results.length; i++) {

                        console.log(results[i]);

                        res.write("Name: " + results[i].name + "<br>");
                        res.write("Ticker: " + results[i].ticker + "<br>");
                        res.write("Price: " + results[i].price + "<br><br>");
                    }
                }

                res.end();
                client.close();
            });

        });
    }

    else {
        res.write("Unknown page");
        res.end();
    }

}).listen(port);