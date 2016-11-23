angular.module('DS.filters', [])
.filter('unique', function () {
  return function (collection, keyname) {
  	console.info(collection)
  	console.info(keyname)
    var output = [],
      	keys = [];
    angular.forEach(collection, function (item) {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});