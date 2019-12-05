var fs = require('fs');
var path = require('path');
var Q = require('q');
const cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

const server = express();
server.use(cors());
server.use(bodyParser.json())
server.use(express.static(__dirname));
server.use(express.static(path.join(__dirname, 'build')));
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
    console.log(data);
    return new Promise((resolve, reject) => {
        const billRef = db.ref().child('bills');
        billRef.child(data.id).set(data.id, (err) => {
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

server.get('/bill', async (request, response) => {
    response.status(200).send(await getBillById(request.query.id));
});

server.get('/', async (request, response) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.post('/createBill', async (request, response) => {
    response.status(200).send(await createBill(request.body));
});

server.listen(PORT, () => {
    console.log('Express server started...');
});
