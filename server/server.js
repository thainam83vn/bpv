var express = require("express");
var mysql = require('mysql');
var cors = require('cors');
var fs = require("fs");
var multer = require('multer');
var csv = require('csvtojson');
var diagramService = require("./diagram.service");

var UPLOAD_PATH = './uploads/';

var bodyParser = require('body-parser');

var infoAWS = {
    host: '54.244.159.69',
    user: 'root',
    password: '20170402',
    database: 'bpv'
};
var infoLocal = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'bpv'
};
var info = infoAWS;

function getConnection() {
    var connection = mysql.createConnection(info);
    connection.connect();
    return connection;
}

function getConnectionMultiStatement() {
    info.multipleStatements = true;
    var connection = mysql.createConnection(info);
    connection.connect();
    return connection;
}

function handleData(res, err, data, fields) {
    if (!err) {
        if (data != null) {
            res.send(data[0]);
            // console.log(data[0]);
        } else {
            res.send({ Status: "OK" });
        }
    } else {
        console.log('Error while performing Query.', err);
    }
}

function handleError(res, err) {
    res.status(500, err);
}


var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/KPIMetric/Diagram/:ParentId/:DiagramName", function(req, res) {
    var diagramName = req.params.DiagramName;
    var parentId = req.params.ParentId;
    setTimeout(() => {
        var upload = multer({ dest: UPLOAD_PATH }).single('svg');

        upload(req, res, (err) => {
            if (err) {
                console.log("Error upload:", err);
                return res.status(422).send("Error uploading.");
            }
            path = req.file.path;
            fs.readFile(path, (err, data) => {
                console.log(data);
                var url = "insert into Diagram set ?",
                    values = { Name: diagramName, ParentId: parseInt(parentId), content: data };

                try {
                    var connection = getConnection();
                    connection.query(url, values, function(err) {
                        connection.end();
                        handleData(res, err, null, null);
                    });
                } catch (ex) {
                    handleError(res, ex);
                }
            });

        });
    }, 100);
});

app.delete("/KPIMetric/Diagram/:Id", function(req, res) {
    console.log(req.params);
    try {
        var url = "delete from diagram where Id=:id"
            .replace(":id", req.params.Id);
        var connection = getConnection();
        connection.query(url, function(err) {
            handleData(res, err, null, null);
            connection.end();
        });
    } catch (ex) {
        handleError(res, ex);
    }

});

app.get("/KPIMetric/GetAllDiagram", function(req, res) {
    try {
        var url = "select * from Diagram";
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            var tree = diagramService.buildTree(data);
            handleData(res, err, [tree], fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/KPIMetric/Diagrams", function(req, res) {
    try {
        var url = "select Id,Name,ParentId from Diagram";
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data[0], fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/KPIMetric/GetByDiagramId/:diagramId", function(req, res) {
    try {
        var url = "CALL sp_getMetricsByDiagramId(:dId)".replace(":dId", req.params.diagramId);
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/KPIMetric/GetMetricByShapeId/:id", function(req, res) {
    try {
        var url = "CALL sp_getMetricByShapeId(:id)".replace(":id", req.params.id);
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/KPIMetric/calculateMetric/:tableName/:column1/:column2/:operator/:aggr", function(req, res) {
    try {
        var url = "CALL sp_calMetric(':tableName', ':opr1', ':opr2', ':operator', ':aggr')"
            .replace(":tableName", req.params.tableName)
            .replace(":opr1", req.params.opr1)
            .replace(":opr2", req.params.opr2)
            .replace(":operator", req.params.operator)
            .replace(":aggr", req.params.aggr);

        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.post("/KPIMetric/createShape", function(req, res) {
    try {
        var shape = req.body;
        var connection = getConnectionMultiStatement();
        diagramService.createShape(shape, connection, function(err, data, fields) {
            handleData(res, err, data, fields);
            connection.end();
        });
    } catch (ex) {
        handleError(res, ex);
    }
});

app.post("/KPIMetric/createMetric", function(req, res) {
    try {
        var metric = req.body;
        var connection = getConnection();
        diagramService.updateMetric(metric, connection, function(err, data, fields) {
            handleData(res, err, data, fields);
            connection.end();
        });
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/DBTableWS/getAllTableName", function(req, res) {
    try {
        var url = "CALL sp_getAllTableName()";
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.delete("/DBTableWS/table/:TableName", function(req, res) {
    try {
        var tableName = req.params.TableName;
        var sql = "delete from customertable where Table_Name=':tableName';drop table `:tableName`;"
            .replace(":tableName", tableName)
            .replace(":tableName", tableName);
        var connection = getConnectionMultiStatement();
        connection.query(sql, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/DBTableWS/data/:TableName", function(req, res) {
    try {
        var tableName = req.params.TableName;
        var sql = "select * from `:tableName`"
            .replace(":tableName", tableName);
        var connection = getConnectionMultiStatement();
        connection.query(sql, function(err, data, fields) {
            handleData(res, err, [data], fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});


function insertData(sqlInsert, list, index, done) {
    try {
        if (index >= list.length) {
            done();
            return;
        }
        var r = list[index];
        var conInsert = getConnection();
        conInsert.query(sqlInsert, r, (err, data, fields) => {
            if (err) throw err;
            conInsert.end();
            insertData(sqlInsert, list, index + 1, done);
        });
    } catch (ex) {
        handleError(res, ex);
    }
}

//upload customer data
app.post("/DBTableWS/table/:TableName", function(req, res) {
    var tableName = req.params.TableName;
    console.log("/DBTableWS/table/:TableName");
    setTimeout(() => {
        var upload = multer({ dest: UPLOAD_PATH }).single('csv');
        upload(req, res, (err) => {
            if (err) {
                console.log("Error upload:", err);
                return res.status(422).send("Error uploading.");
            }
            path = req.file.path;
            var list = [];
            csv().fromFile(path)
                .on('json', (jsonObj) => {
                    // combine csv header row and csv line to a json object 
                    // jsonObj.a ==> 1 or 4 
                    if (jsonObj.Customer != '') {
                        //console.log(jsonObj);
                        list.push(jsonObj);
                    }
                })
                .on('done', (error) => {
                    if (list.length > 0) {
                        var con = getConnectionMultiStatement();
                        try {
                            var first = list[0];
                            var sqlCreateTable = "";
                            for (var c in first) {
                                sqlCreateTable += "`:column` text,".replace(":column", c);
                            }
                            sqlCreateTable = sqlCreateTable.substr(0, sqlCreateTable.length - 1);
                            sqlCreateTable = "Create Table `:tableName`(:columns); insert into customertable values(':tableName');"
                                .replace(":tableName", tableName)
                                .replace(":tableName", tableName)
                                .replace(":columns", sqlCreateTable);
                            //console.log(sqlCreateTable);
                            con.query(sqlCreateTable, function(err, data, fields) {
                                if (err) throw err;
                                con.end();

                                var sqlInsert = "insert into `:tableName` set ?".replace(":tableName", tableName);
                                insertData(sqlInsert, list, 0, () => {
                                    res.send({ Status: "OK" });
                                });
                            });
                        } catch (ex) {
                            handleError(res, ex);
                        }
                    }
                });
        });
    }, 100);
});


app.get("/DBTableWS/getColumnNameByTable/:tableName", function(req, res) {
    try {
        var url = "CALL sp_getColumnByTable(':tableName')"
            .replace(":tableName", req.params.tableName);
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/ShapeWS/GetConfigurableShapeByDiagramId/:id", function(req, res) {
    try {
        var url = "CALL sp_getShapeByDiagramId(:id)"
            .replace(":id", req.params.id);
        var connection = getConnection();
        connection.query(url, function(err, data, fields) {
            handleData(res, err, data, fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.get("/Table/:tableName/SelectAll", function(req, res) {
    try {
        var tableName = req.params.tableName;
        var connection = getConnection();
        var sql = "select * from " + tableName;
        connection.query(sql, function(err, data, fields) {
            handleData(res, err, [data], fields);
        });
        connection.end();
    } catch (ex) {
        handleError(res, ex);
    }
});

app.listen(3000);