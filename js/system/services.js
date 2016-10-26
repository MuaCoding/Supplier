angular.module('DS.services', [])

//直接返回Http的Promise(类Jquery写法)
.factory('HttpFact', function ($q, $http, $location, PopupFact) {
    function execHttp(httpJson) {
        var deferred = $q.defer();//声明延后执行，表示要去监控后面的执行

        $http(httpJson).
        success(function (data, status, headers, config) {
            deferred.resolve(data);//声明执行成功，即http请求数据成功，可以返回数据了
        }).
        error(function (data, status, headers, config) {
            deferred.reject(data);//声明执行失败，即服务器返回错误
        });

        return deferred.promise;//返回承诺，这里并不是最终数据，而是访问最终数据的API  
    }

    return {
        get: function (url, params) {
            var httpJson = {
                method: "GET",
                url: url,
                params: params
            };

            return execHttp(httpJson);
        },
        post: function (url, data, params) {
            var httpJson = {
                method: "POST",
                url: url,
                data: data,
                params: params
            };

            return execHttp(httpJson);
        },
        method: function (method, url, data, params) {
            var httpJson = {
                method: method,
                url: url,
                data: data,
                params: params
            };

            return execHttp(httpJson);
        },
        user: {
            POST: function (url, data, params) {
                var httpJson = {
                    method: "POST",
                    url: url,
                    data: data,
                    headers: {
                        "User-Token": window.localStorage.getItem("LLS_Token")
                    },
                    params: params
                };

                return execHttp(httpJson);
            }
        }
    };
})

//提示框
.factory('PopupFact', function ($ionicPopup) {
    var nowPopup;

    return {
        alert: function (title, msg, callback) {
            this.clear();

            nowPopup = $ionicPopup.alert({
                title: title,
                template: msg,
                okText: "确定"
            });

            nowPopup.then(function (res) {
                try {
                    callback();
                }
                catch (e) { }
            });

            return nowPopup;
        },
        confirm: function (title, msg, okText, cancelText) {
            this.clear();

            nowPopup = $ionicPopup.confirm({
                title: title,
                template: msg,
                okText: okText || "确定",
                cancelText: cancelText || "取消"
            });

            return nowPopup;
        },
        show: function (data) {
            this.clear();

            nowPopup = $ionicPopup.show(data);

            return nowPopup;
        },
        clear: function () {
            try {
                nowPopup.close();
            }
            catch (e) { }
        }
    }
})

//弹出层
.factory('ModalFact', function ($ionicModal, LoadingFact) {
    var nowModal = {}, modalRemove = false;
    var nowScope = {}, nowUrl = "";

    return {
        init: function (scope, url) {
            nowScope = scope;
            nowUrl = url;
            this.clear();

            var modalPromise = $ionicModal.fromTemplateUrl(url, {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: true
            });

            return modalPromise;
        },
        show: function (scope, url) {
            if (scope == nowScope && url == nowUrl && !modalRemove) {
                nowModal.show();
            }
            else {
                LoadingFact.show();

                var modalPromise = this.init(scope, url);

                modalPromise.then(function (modal) {
                    LoadingFact.hide();

                    nowModal = modal;
                    modalRemove = false;
                    modal.show();
                });
            }
        },
        hide: function () {
            try {
                nowModal.hide();
            }
            catch (e) { }
        },
        clear: function () {
            try {
                modalRemove = true;
                nowModal.remove();
            }
            catch (e) { }
        }
    }
})

//加载中
.factory('LoadingFact', function ($ionicLoading) {
    return {
        show: function () {
            $ionicLoading.show({
                template: '<ion-spinner class="myLoading"></ion-spinner>',
                hideOnStateChange: true,
                delay: 120
            });
        },
        hide: function () {
            $ionicLoading.hide();
        }
    }
})