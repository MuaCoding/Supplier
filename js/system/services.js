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
                    contentType: "application/json;charset=UTF-8",
                    headers: {
                        "User-Token": window.localStorage.getItem("User-Token")
                    },
                    params: params
                };

                return execHttp(httpJson);
            },
            // beforeSend:function(request){request.setRequestHeader("User-Token",localStorage.getItem('User-Token'))},
            GET: function (url, data, params) {
                var httpJson = {
                    method: "GET",
                    url: url,
                    data: data,
                    contentType: "application/json;charset=UTF-8",
                    headers: {
                        "User-Token": window.localStorage.getItem("User-Token")
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
            }).then(function (res) {
                eval(callback);
            });

            return nowPopup;
        },
        confirm: function (title, msg, okText, cancelText, callback1, callback2) {
            this.clear();

            nowPopup = $ionicPopup.confirm({
                title: title,
                template: msg,
                okText: okText || "确定",
                cancelText: cancelText || "取消"
            }).then(function (res) {
                if (res) {
                    eval(callback1);
                } else {
                    eval(callback2);
                };
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

//验证判断
.factory('judgeFact', function (PopupFact) {
    return {
        /*--------------手机验证-----------------*/
        mob: function (mob) {
            if (mob == "" || mob == null) {
                PopupFact.alert("提示", "请填写手机号!");
                return false;
            }
            //判断手机位数
            if (mob.length < 11 || mob.length > 11) {
                PopupFact.alert("提示", "输入的手机号不正确！");
                return false;
            }
            //判断手机头
            if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(mob) == false) {
                PopupFact.alert("提示", "输入的手机号不正确！");
                return false;
            }
            return true;
        },

        /*-----------------邮箱验证--------------------*/
        email: function (email) {
            if (email == "" || email == null) {
                PopupFact.alert("提示", "请填写正确的邮箱!");
                return false;
            }
            if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) == false) {
                PopupFact.alert("提示", "邮箱格式不正确，请重新填写!");
                return false;
            }
            return true;
        },

        /*-----------------身份证验证--------------------*/
        checkIdCard: function (idCard, sex, SR) {
            function Append_zore(temp) {
                if (temp < 10) {
                    return "0" + temp;
                }
                else {
                    return temp;
                }
            };

            if (idCard != "") {
                //身份证的地区代码对照  
                // var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
                //获取证件号码  
                var person_id = idCard;
                //合法性验证  
                var sum = 0;
                //出生日期  
                // var birthday;
                //验证长度与格式规范性的正则  
                var pattern = new RegExp(/(^\d{15}$)|(^\d{17}(\d|x|X)$)/i);
                if (pattern.exec(person_id)) {
                    //验证身份证的合法性的正则  
                    pattern = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/);
                    if (pattern.exec(person_id)) {
                        //获取15位证件号中的出生日期并转位正常日期       
                        // birthday = "19" + person_id.substring(6, 8) + "-" + person_id.substring(8, 10) + "-" + person_id.substring(10, 12);
                    }
                    else {
                        person_id = person_id.replace(/x|X$/i, "a");
                        //获取18位证件号中的出生日期  
                        // birthday = person_id.substring(6, 10) + "-" + person_id.substring(10, 12) + "-" + person_id.substring(12, 14);

                        //校验18位身份证号码的合法性  
                        for (var i = 17; i >= 0; i--) {
                            sum += (Math.pow(2, i) % 11) * parseInt(person_id.charAt(17 - i), 11);
                        }
                        if (sum % 11 != 1) {
                            PopupFact.alert("提示", "身份证号码不符合国定标准，请核对！");
                            return;
                        }
                    }
                    //检测证件地区的合法性                                  
                    // if (aCity[parseInt(person_id.substring(0, 2))] == null) {
                    //   PopupFact.alert("提示", "身份证地区未知，请核对！");
                    //   return;
                    // }
                    // var dateStr = new Date(birthday.replace(/-/g, "/"));

                    // if (birthday != (dateStr.getFullYear() + "-" + Append_zore(dateStr.getMonth() + 1) + "-" + Append_zore(dateStr.getDate()))) {
                    //   PopupFact.alert("提示", "身份证出生日期非法！");
                    //   return;
                    // }

                    // if (sex != null) {
                    //   var user_XB = idCard.substring(16, 17);
                    //   if (user_XB % 2 == 0) {
                    //     sex = 1;
                    //   }
                    //   else {
                    //     sex = 0;
                    //   }
                    // }

                    // if (SR != null) {
                    //   SR = idCard.substring(6, 10) + "-" + idCard.substring(10, 12) + "-" + idCard.substring(12, 14);
                    // }

                    // return sex;
                }
                else {
                    PopupFact.alert("提示", "身份证号码格式非法！");
                    return;
                }
            }
            else {
                PopupFact.alert("提示", "请输入证件号！");
                return;
            }
        }
    }
})

//获取地址栏带过来的指定参数
.factory('getQueryStringFact', function () {
    return {
        get: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    };
})

//权限判断
.factory('privilegeFact', function ($state, HttpFact, PopupFact) {
    return {
        privilegeJudge: function (method1, method2) {
            HttpFact.post(domain + "/api/user/loadsignUpTime1").then(
            function (data) {
                if (data.res_Code == 1) {
                    eval(method1);
                }
                else if (data.res_Code == -1) {
                    eval(method2);
                };
            },
            function (data) {
                PopupFact.alert("prompt", "Data abnormal, please refresh and retry!");
            })
        }
    }
})


//判断登录状态
.factory('loginJumpFact', function () {
    return {
        tokenJudge: function (Url) {
            if (window.localStorage.getItem("User-Token") == "" || window.localStorage.getItem("User-Token") == null) {
                location.href = "/login?url=" + Url;
            }
        }
    }
})
