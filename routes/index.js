var express = require('express');
var router = express.Router();


//connect database mongoDB

const MongoClient = require('mongodb').MongoClient;

var chuyenthanhObjectID = require('mongodb').ObjectID;

const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'contact';

//end connect dbs


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/them', function (req, res, next) {
  res.render('them', { title: 'Thêm dữ liệu' });
});

/* GET home page. */
router.post('/them', function (req, res, next) {
  var ten = req.body.ten,
    std = req.body.std
    ;
  if(ten!=''&&std!=''){
      var duLieu01 = {
        "ten": ten,
        "std": std
      }

    const insertDocuments = function (db, callback) {
      // Get the documents collection
      const collection = db.collection('nguoidung');
      // Insert some documents
      collection.insert(duLieu01, function (err, result) {
        assert.equal(err, null);
        //console.log("Thêm dữ liệu thanh công");
        callback(result);
      });
    }

    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      insertDocuments(db, function () {
        client.close();
      });
    });

    res.redirect("/xem");
  }

});

/* GET xem */
router.get('/xem', function (req, res, next) {

  const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    findDocuments(db, function (dulieu) {
      res.render('xem', { title: 'Xem dữ liệu', data: dulieu });
      //console.log(dulieu);
      client.close();
    });
  });

});

/* GET Xóa. */
router.get('/xoa/:idcanxoa', function (req, res, next) {

  var idcanxoa = chuyenthanhObjectID(req.params.idcanxoa);

  const removeDocument = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Delete document where a is 3
    collection.deleteOne({ _id: idcanxoa }, function (err, result) {
      assert.equal(err, null);
      callback(result);
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Xoa thanh cong");

    const db = client.db(dbName);
    removeDocument(db, function () {
      client.close();
      res.redirect('/xem');
    });
  });
  //res.redirect('/xem');
  //res.render('xem', { title: 'xóa' });
});


/* GET sửa dữ liệu. */
router.get('/sua/:idcansua', function (req, res, next) {
  var idcansua = chuyenthanhObjectID(req.params.idcansua);

  const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({ _id: idcansua }).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Tìm thấy dữ liệu");
      callback(docs);
    });
  }

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    findDocuments(db, function (dulieu) {
      res.render('sua', { title: 'Sửa dữ liệu', data: dulieu });
      console.log(dulieu);
      client.close();
    });
  });

  console.log(idcansua);

});


/* GET home page. */
router.post('/sua/:idcansua', function (req, res, next) {

  var idcansua = chuyenthanhObjectID(req.params.idcansua);
  var duLieu = {
    "ten": req.body.ten,
    "sdt": req.body.std
  };
  const updateDocument = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ _id: idcansua }
      , { $set: duLieu }, function (err, result) {
        assert.equal(err, null);
        console.log("update thành công");
        callback(result);
        res.redirect("/xem");
      });
  }

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    updateDocument(db, function () {
      client.close();
    });
  });

  console.log(duLieu);
});

// search theo tên
router.post('/search', function (req, res, next) {

  console.log("this is name: ",req.body.nameSearch);

  const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({
      ten: req.body.nameSearch
    }).toArray(function (err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    findDocuments(db, function (dulieu) {
      res.render('xem', { title: 'Xem dữ liệu', data: dulieu });
      
      console.log(dulieu);

      client.close();
    });
  });


 
});






module.exports = router;
