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

        res.write(`
        <html>
        <head>
        <title>Stock App</title>
        <style>
        body {
            font-family: Arial;
            background-color: #f4f4f4;
            text-align: center;
        }

        .container {
            background: white;
            padding: 20px;
            margin: 100px auto;
            width: 300px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px gray;
        }

        input[type=text] {
            width: 90%;
            padding: 8px;
            margin: 10px 0;
        }

        button {
            padding: 10px;
            background: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
        }
        </style>
        </head>

        <body>
        <div class="container">
        <h2>Stock Search</h2>

        <form method="get" action="/process">
            <input type="text" name="search" placeholder="Enter company or ticker"><br>

            <input type="radio" name="type" value="company" checked> Company
            <input type="radio" name="type" value="ticker"> Ticker<br><br>

            <button type="submit">Search</button>
        </form>

        </div>
        </body>
        </html>
        `);

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

                res.write(`
                <html>
                <head>
                <style>
                body {
                    font-family: Arial;
                    background-color: #f4f4f4;
                    text-align: center;
                }

                .result-box {
                    background: white;
                    margin: 20px auto;
                    padding: 15px;
                    width: 300px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px gray;
                }
                </style>
                </head>

                <body>
                <h2>Results</h2>
                `);

                if (results.length == 0) {
                    res.write("<p>No results found</p>");
                } else {

                    for (var i = 0; i < results.length; i++) {

                        console.log(results[i]);

                        res.write(`
                        <div class="result-box">
                        Name: ${results[i].name}<br>
                        Ticker: ${results[i].ticker}<br>
                        Price: ${results[i].price}
                        </div>
                        `);
                    }
                }

                res.write(`<br><a href="/"><button>Back to Search</button></a>`);
                res.write("</body></html>");

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
