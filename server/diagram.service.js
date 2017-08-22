function buildTree(diagrams) {
    var tree = { Id: 0, Children: [] };
    for (let d of diagrams) {
        var child = { Id: d.Id, Name: d.Name, Content: d.content + "", Children: [] };
        if (d.ParentId == null || d.ParentId == 0) {
            tree.Children.push(child);
        } else {
            var parent = findParent(tree, d.ParentId);
            if (parent) {
                parent.Children.push(child);
            }
        }
    }
    return tree.Children;
}

function findParent(tree, id) {
    if (id == tree.Id)
        return tree;
    for (let node of tree.Children) {
        var found = findParent(node, id);
        if (found) return found;
    }
    return null;
}

function updateMetric(metric, connection, callback) {
    var url = "";
    if (metric.Id == null || metric.Id == 0) {
        url = "insert into Metric(Column1,Column2,Operator,`Table`,Aggregation,ShapeId) values(':column1',':column2',':operator',':table',':aggregation',:shapeId) "
            .replace(":column1", metric.Column1)
            .replace(":column2", metric.Column2)
            .replace(":operator", metric.Operator)
            .replace(":table", metric.Table)
            .replace(":aggregation", metric.Aggregation)
            .replace(":shapeId", metric.ShapeId);
    } else {
        url = "update Metric set Column1=':column1',Column2=':column2',Operator=':operator',`Table`=':table',Aggregation=':aggregation',ShapeId=:shapeId where Id=:id"
            .replace(":id", metric.Id)
            .replace(":column1", metric.Column1)
            .replace(":column2", metric.Column2)
            .replace(":operator", metric.Operator)
            .replace(":table", metric.Table)
            .replace(":aggregation", metric.Aggregation)
            .replace(":shapeId", metric.ShapeId);
    }

    console.log("Create ", url);
    connection.query(url, function(err, data, fields) {
        url = "call sp_computeMetric(:shapeId,':tableName',':column1',':column2', ':operator',':aggr')"
            .replace(":shapeId", metric.ShapeId)
            .replace(":tableName", metric.Table)
            .replace(":column1", metric.Column1)
            .replace(":column2", metric.Column2)
            .replace(":operator", metric.Operator)
            .replace(":aggr", metric.Aggregation);
        console.log("update metric:", url);
        connection.query(url, (err, data, fields) => {
            callback(err, data, fields);
        });
    });
}

function createShape(shape, connection, callback) {
    var url = "";
    url = "insert into Shape(DiagramId, ShapeId) values(:diagramId,':shapeId');select * from Shape where ShapeId=':shapeId' and DiagramId=:diagramId;"
        .replace(":diagramId", shape.DiagramId).replace(":diagramId", shape.DiagramId)
        .replace(":shapeId", shape.ShapeId).replace(":shapeId", shape.ShapeId);
    console.log("Create ", url);
    connection.query(url, function(err, data, fields) {
        callback(err, data[1], fields);
    });
}

module.exports = {
    buildTree: buildTree,
    updateMetric: updateMetric,
    createShape: createShape
};