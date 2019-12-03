var fs = require('fs');
var path = require('path');
var Q = require('q');
const cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

const server = express();
const PORT = 8081;

//************************************ Products ****************************************************/
const commentFile = path.join(__dirname, 'products.json');
const readData = function () {
    var defer = Q.defer();
    fs.readFile(commentFile, function (error, data) {
        if (error) {
            console.log(error);
            return defer.reject(error);
        }
        return defer.resolve(JSON.parse(data));
    });
    return defer.promise;
};

var getProducts = function () {
    return readData().then(function (data) {
        return data;
    });
};

server.get('/products', function (req, res) {
    getProducts().then(function (data) {
        res.json(data);
    }).fail(function (error) {
        console.error(error);
        res.sendStatus(500);
    });
});
//************************************ Firebase function *******************************************/
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./medicationbook-firebase-adminsdk-fn0fn-ae1064056c.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://medicationbook.firebaseio.com"
});
const db = firebaseAdmin.database();

getBillById = (id) => {
    return new Promise((resolve, reject) => {
        const billRef = db.ref().child('bills').child(id);
        billRef.on("value", function (snapshot) {
            resolve(snapshot.val());
        }, function (errorObject) {
            reject(errorObject.code);
        });
    });
};


createBill = (data) => {
    return new Promise((resolve, reject) => {
        const billRef = db.ref().child('bills');
        billRef.set(data.id, (err) => {
            billRef.child(data.id).set(data);
            if (err) {
                reject(err);
            } else {
                resolve('successfully');
            }
        });
    });
};

//************************************ REST API *********************************************/
server.set('port', process.env.PORT || PORT);

//Adding routes
server.get('/pos', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

server.get('/bill/:id', async (request, response) => {
    response.status(200).send(await getBillById());
});

server.post('/createBill', async (request, response) => {
    response.status(200).send(await getBillById());
});

server.listen(PORT, () => {
    console.log('Express server started...');
});
