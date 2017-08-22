"use strict";
var CSS = (function () {
    function CSS() {
    }
    return CSS;
}());
CSS.COLORS = ['#00008B', '#666699', '#654321', '#88654E', '#5D3954', '#A40000', '#08457E', '#986960', '#CD5B45', '#008B8B', '#536878', '#B8860B', '#A9A9A9', '#013220', '#006400', '#1F262A', '#00416A', '#00147E', '#1A2421', '#BDB76B', '#483C32', '#734F96', '#534B4F', '#543D37', '#8B008B', '#A9A9A9', '#003366', '#4A5D23', '#556B2F', '#FF8C00', '#9932CC', '#779ECB', '#03C03C', '#966FD6', '#C23B22', '#E75480', '#003399', '#4F3A3C', '#301934', '#872657', '#8B0000', '#E9967A', '#560319', '#8FBC8F', '#3C1414', '#8CBED6', '#483D8B', '#2F4F4F', '#177245', '#918151', '#FFA812', '#483C32', '#CC4E5C', '#00CED1', '#D1BEA8', '#9400D3', '#9B870C', '#00703C', '#555555', '#D70A53', '#40826D', '#A9203E', '#EF3038', '#E9692C', '#DA3287', '#FAD6A5', '#B94E48', '#704241', '#C154C1', '#056608', '#0E7C61', '#004B49', '#333366', '#F5C71A', '#9955BB', '#CC00CC', '#820000', '#D473D4', '#355E3B', '#FFCBA4', '#FF1493', '#A95C68', '#850101', '#843F5B', '#FF9933', '#00BFFF', '#4A646C', '#556B2F', '#7E5E60', '#66424D', '#330066', '#BA8759', '#1560BD', '#2243B6', '#669999', '#C19A6B', '#EDC9AF', '#EA3C53', '#B9F2FF', '#696969', '#C53151', '#9B7653', '#1E90FF', '#FEF65B', '#D71868', '#85BB65', '#828E84', '#664C28', '#967117', '#00009C', '#E5CCC9', '#EFDFBB', '#E1A95F', '#555D50', '#C2B280', '#1B1B1B', '#614051'];
exports.CSS = CSS;
var DataVisualization = (function () {
    function DataVisualization() {
    }
    DataVisualization.createHeatMap = function (meta, dataset) {
        for (var i = 0; i < meta.Items.length; i++) {
            var cell = meta.Items[i];
            var ls = DataCommon.where(dataset, function (e1) {
                return e1[meta.XFieldName] >= cell.X.From && e1[meta.XFieldName] < cell.X.To
                    && e1[meta.YFieldName] >= cell.Y.From && e1[meta.YFieldName] < cell.Y.To;
            });
            cell.Result = ls;
        }
    };
    DataVisualization.createPointMap = function (meta, dataset) {
        for (var i = 0; i < meta.Items.length; i++) {
        }
    };
    return DataVisualization;
}());
exports.DataVisualization = DataVisualization;
var DataCommon = (function () {
    function DataCommon() {
    }
    DataCommon.csv2object = function (csv) {
        var lines = csv.split('\n');
        var headers = lines[0].split(',');
        var dataset = [];
        for (var i = 1; i < lines.length; i++) {
            var values = lines[i].split(',');
            var obj = {};
            for (var j = 0; j < headers.length && j < values.length; j++) {
                obj[headers[j]] = values[j];
            }
            dataset.push(obj);
        }
        return dataset;
    };
    DataCommon.copy = function (src, dest) {
        for (var prop in src) {
            if (prop != null && prop != "")
                dest[prop] = src[prop];
        }
        // src.forEach((element: any) => {
        //     dest[element] = src[element];
        // });
    };
    DataCommon.where = function (dataset, condition) {
        var result = [];
        dataset.forEach(function (element) {
            if (condition(element)) {
                result.push(element);
            }
        });
        return result;
    };
    DataCommon.firstOrDefault = function (dataset, condition) {
        var result = DataCommon.where(dataset, condition);
        if (result.length == 0)
            return null;
        return result[0];
    };
    DataCommon.distinct = function (dataset, getValue) {
        var result = [];
        for (var _i = 0, dataset_1 = dataset; _i < dataset_1.length; _i++) {
            var element = dataset_1[_i];
            var value = getValue(element);
            if (result.indexOf(value) < 0 && value != null) {
                result.push(value);
            }
        }
        return result;
    };
    DataCommon.groupBy = function (dataset, keyHandle, processFunc) {
        var groupList = [];
        for (var _i = 0, dataset_2 = dataset; _i < dataset_2.length; _i++) {
            var element = dataset_2[_i];
            var key = keyHandle(element);
            var item = DataCommon.firstOrDefault(groupList, function (element) {
                return (element["Key"] == key);
            });
            if (item == null) {
                item = {
                    Key: key,
                    Items: []
                };
                groupList.push(item);
            }
            item.Items.push(element);
            if (processFunc)
                processFunc(item, element);
        }
        return groupList;
    };
    DataCommon.aggreation = function (dataset, aggreationFunc, getValueFunc) {
        var result = [];
        var _loop_1 = function (element) {
            item = DataCommon.firstOrDefault(result, function (e) {
                return e.Key == element.Key;
            });
            if (item == null) {
                item = { Key: element.Key, Value: 0 };
                result.push(item);
            }
            value = getValueFunc(element);
            newValue = aggreationFunc(item.Value, value);
            item.Value = newValue;
        };
        var item, value, newValue;
        for (var _i = 0, dataset_3 = dataset; _i < dataset_3.length; _i++) {
            var element = dataset_3[_i];
            _loop_1(element);
        }
    };
    DataCommon.sum = function (dataset, getValueFunc) {
        var result = 0;
        for (var _i = 0, dataset_4 = dataset; _i < dataset_4.length; _i++) {
            var element = dataset_4[_i];
            var value = getValueFunc(element);
            result += value;
        }
        return result;
    };
    DataCommon.avg = function (dataset, getValueFunc) {
        var result = DataCommon.sum(dataset, getValueFunc);
        return result / dataset.length;
    };
    DataCommon.lookupValue = function (dataset, getValueFunc, compareFunc) {
        var result = getValueFunc(dataset[0]);
        for (var _i = 0, dataset_5 = dataset; _i < dataset_5.length; _i++) {
            var element = dataset_5[_i];
            var value = getValueFunc(element);
            if (result == null)
                result = value;
            else if (compareFunc(value, result))
                result = value;
        }
        return result;
    };
    return DataCommon;
}());
exports.DataCommon = DataCommon;
//# sourceMappingURL=data-common.js.map