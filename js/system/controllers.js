
angular.module('DS.controllers', [])

//首页
.controller('homeController', function ($scope, $filter, $rootScope, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout, HttpFact, PopupFact, privilegeFact, ModalFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);

    /////轮播
    //清除缓存，否则轮播报错
    $rootScope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.banners = [];
    function getBanner(count) {
        var submit = {
            count: count,
        }
        HttpFact.user.POST(domain + "/api/Art/getBanner", submit).then(
            function (data) {
                $scope.banners = JSON.parse(data);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.banners = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');

            }
        )
    }


    ////////获取热销产品数据//////////
    var page = 1;
    var size = 4;
    var _size = 3;
    //banner
    var count = 3;

    $scope.noData = true;
    $scope.hotProduct = {
        array_1: []
    }


    //热销
    function getData(page, size, strW, orderby) {
        var hotData = {
            current: page, //当前页数
            count: size, //单页条数
            strW: "",
            orderby: "PD.p_saleNum DESC,"
        }
        HttpFact.user.POST(domain + "/api/Product/getProductList", hotData).then(
            function (data) {
                
                jsonData = JSON.parse(data);
                console.log(jsonData)
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.hotProduct.array_1 = $scope.hotProduct.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.hotProduct.array_1 = $scope.hotProduct.array_1.concat(jsonData.array_1);
                    
                };
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.hotProduct = {
                    array_1: []
                }
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )
    }

    /////新品上架
    $scope.newProducts = [];
    function getNew(page, _size, strW, orderby) {
        var newData = {
            current: page, //当前页数
            count: _size, //单页条数
            strW: "",
            orderby: "PD.p_saleNum DESC,"
        }
        HttpFact.user.POST(domain + "/api/Product/getProductList", newData).then(
            function (data) {
                $scope.newProducts = JSON.parse(data);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.newProducts = [];
                //if (window.localStorage.getItem("User-Token") == "" || window.localStorage.getItem("User-Token") == null) {
                //    PopupFact.alert("提示", "用户信息已失效，重新登录",'');
                //    loginJumpFact.tokenJudge(location.href)
                //    return;
                //}

                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )
    }

    //离开视图时执行事件
    $scope.$on("$ionicView.beforeLeave", function () {
        ModalFact.hide();
    });
    $scope.AllModel = {
        SearchModel: [

        ],
    };
    if (localStorage.getItem("SearchList")) {
        var UserSearchList = JSON.parse(localStorage.getItem("SearchList"));
        $scope.AllModel.SearchModel = UserSearchList;
    }

    $scope.SetCheck = function (v1, v2) {
        for (var i = 0; i < v2.length; i++) {
            v2[i].Check = false;
        }
        v1.Check = !v1.Check;
    };

    $scope.onItemDelete = function (item) {
        $scope.AllModel.SearchModel.splice($scope.AllModel.SearchModel.indexOf(item), 1);
    }
    $scope.onDelete = function () {
        $scope.AllModel.SearchModel = [];
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(page, size, "", "");
        getBanner(count);
        getNew(page, _size, "", "")
    });

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getData(page, size, "", "");
        getBanner(count);
    }



})

//产品
.controller('productListController', function ($scope, $rootScope, ModalFact, HttpFact, $ionicScrollDelegate, loginJumpFact) {
    //
    loginJumpFact.tokenJudge("location.href");

    $scope.screenClick = function () {
        ModalFact.show($scope, "/templates/model/pd-Screening.html");
    };
    $scope.closeModal = function () {
        ModalFact.hide();
    };

    var page = 1;
    var size = 6;
    $scope.noData = true;
    $scope.listProduct = {
        array_1: []
    }
    function getData(current, count, provId, strW, orderby) {
        var submitData = {
            current: current, //当前页数
            count: count, //单页条数
            strW: "",
            orderby: "PD.p_addtime DESC,"
        }
        HttpFact.user.POST(domain + "/api/Product/getProductList", submitData).then(
            function (data) {
                jsonData = JSON.parse(data);
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);

                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.listProduct.array_1 = $scope.listProduct.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.listProduct.array_1 = $scope.listProduct.array_1.concat(jsonData.array_1);
                };
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.listProduct = {
                    array_1: []
                }
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(page, size, 1, 0, "");

    });
    //离开视图时执行事件
    $scope.$on("$ionicView.beforeLeave", function () {
        ModalFact.hide();
    });


    $scope.SetCheck = function (v1, v2) {
        for (var i = 0; i < v2.length; i++) {
            v2[i].Check = false;
        }
        v1.Check = !v1.Check;
    };

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getData(page, size, 1, 0, "");
    }
})

//产品详情
.controller('productDetailsController', function ($scope, $ionicPopover, filterFilter, $timeout, $ionicScrollDelegate, $stateParams, $state, $rootScope, HttpFact, judgeFact, PopupFact, $ionicSlideBoxDelegate, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.lowNumber = {
        low1: 100,
        low2: 250,
        low3: 1000,
    }

    //商品详情(基本包)
    $scope.basicImg = []
    $scope.parmeImg = []
    $scope.basicData = []
    $scope.miniNum = [] //最低购买数量


    function getDetailData(Id) {
        var detail = {
            id: Id
        }
        HttpFact.user.GET(domain + "/api/Product/getProductDetail?id=" + Id).then(
            function (data) {
                $scope.basicData = JSON.parse(data);
                $scope.basicImg = $scope.basicData[0].p_Pic.split(',');
                $scope.miniNum = Number($scope.basicData[0].p_valuationNum);
                $scope.lowNumber.low1 = Number($scope.basicData[0].p_priceScopeTitle1);
                $scope.lowNumber.low2 = Number($scope.basicData[0].p_priceScopeTitle2);
                $scope.lowNumber.low3 = Number($scope.basicData[0].p_priceScopeTitle3);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {

                $scope.basicData = []
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }

        )
    }
    //初始值
    $scope.initial1 = '',
    $scope.initial2 = '';
    $scope.initial3 = '';

    //商品详情(参数包)
    $scope.detailParme = [];
    $scope.storages = []
    function getParame(Id) {
        HttpFact.user.GET(domain + "/api/Product/getProductParame?id=" + Id).then(
            function (data) {

                $scope.detailParme = JSON.parse(data)
                $scope.input.color = $scope.detailParme.p_param1;
                $scope.parmeImg = $scope.detailParme[0].p_pic.split(',');

                //匹配版本
                var obj = filterFilter($scope.detailParme, { p_param1: $scope.input.color }, true);
                $scope.TypeModelList = [];  //版本
                var type = []
                for (var i = 0; i < obj.length; i++) {
                    type.push(obj[i].p_param2);
                }
                $scope.TypeModelList = unique(type)
                //unique
                var temp = [] //定义变量存储push的数据
                $scope.temps = [];  //定义处理后的数据

                for (var i = 0; i < $scope.detailParme.length; i++) {
                    temp.push($scope.detailParme[i].p_param1);
                }
                $scope.temps = unique(temp)
                //initial
                $scope.initial1 = $scope.detailParme[0].p_priceScope1;
                $scope.initial2 = $scope.detailParme[0].p_priceScope2;
                $scope.initial3 = $scope.detailParme[0].p_priceScope3;

            },
            function (data) {
                $scope.detailParme = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )
    }

    //去重复
    function unique(arr) {
        var tmp = new Array();

        for (var m in arr) {
            tmp[arr[m]] = 1;
        }

        //再把键和值的位置再次调换
        var tmparr = new Array();

        for (var n in tmp) {
            tmparr.push(n);
        }

        return tmparr;
    }


    //选中颜色和版本
    var value = '';
    var key = '';
    $scope.prices = {
        price1: '',
        price2: '',
        price3: ''
    }

    // $scope.productId = '';   //选择的产品ID
    // $scope.paramId = '';   //选择的参数ID
    $scope.storage = '';  //库存
    function match() {
        if (value == '' || key == '') {
            return;
        }
        else {
            //筛选
            var arr = filterFilter($scope.detailParme, { p_param2: key, p_param1: value }, true)
            for (var i = 0; i < arr.length; i++) {
                $scope.prices.price1 = arr[i].p_priceScope1;
                $scope.prices.price2 = arr[i].p_priceScope2;
                $scope.prices.price3 = arr[i].p_priceScope3;
                $scope.productId = arr[i].p_proId;  //产品id
                $scope.paramId = arr[i].p_id;   //参数包id
                $scope.inStock = Number(arr[i].p_storage);  //库存
            }

        }
        console.log(arr);
    }

    //选择版本
    $scope.input.version = []
    $scope.select_version = function (version) {
        $scope.input.version = version;
        key = version;
        match();
    }

    //选择颜色
    $scope.select_color = function (item) {
        $scope.input.color = item;
        value = item;
        match();
        //过滤相同
        var obj = filterFilter($scope.detailParme, { p_param1: item }, true);
        $scope.TypeModelList = [];
        for (var i = 0; i < obj.length; i++) {
            $scope.TypeModelList.push(obj[i].p_param2);
        }

        $scope.Numblur();
    }

    //商品信息购买界面
    $scope.popoverPro;
    $ionicPopover.fromTemplateUrl("/templates/model/ez-popover.html", {
        scope: $scope
    })
    .then(function (popover) {
        $scope.popoverPro = popover;
    });

    //打开商品信息购买界面
    $scope.payProClick = function ($event) {
        $scope.popoverPro.show($event);
    };
    //关闭商品信息购买界面
    $scope.closePopover = function () {
        $scope.popoverPro.hide();
    };
    //销毁事件回调处理：清理popover对象
    $scope.$on("$destroy", function () {
        $scope.popoverPro.remove();
    });



    var arr = [];
    // $scope.inStock = '';

    var miniNum = '';

    $scope.varlist = {
        itemNum: '1',

    }

    // 减
    $scope.minus = function () {
        if ($scope.varlist.itemNum <= 1) {
            $scope.varlist.itemNum = 1

        }
        else {
            $scope.varlist.itemNum--;
        }
    }
    // 加
    $scope.add = function () {
        if ($scope.varlist.itemNum >= $scope.inStock) {
            PopupFact.alert("提示", "已达到最大库存数量");
            $scope.Numblur()
        } else {
            $scope.varlist.itemNum++;
        }
    }
    //判断库存量，如果大于库存量，最大数重置为最大库存量
    $scope.Numblur = function () {
        if ($scope.varlist.itemNum > $scope.inStock) {
            $scope.varlist.itemNum = $scope.inStock;
        }
    }


    $scope.isActive = false;
    $scope.ChangeIsActive = function () {
        $scope.isActive = !$scope.isActive;
    }


    $scope.add_action = function (productId, paramId, Num) {
        HttpFact.user.POST(domain + "/api/Order/shoppingCartAdd", { productId: $scope.productId, paramId: $scope.paramId, Num: $scope.varlist.itemNum }).then(
            function (data) {
                switch (data) {
                    case '0':
                        PopupFact.alert("提示", "该物品已加入进货单（无需重复操作）");
                        break;
                    case '1':
                        PopupFact.alert("提示", "成功加入进货单");
                        break;
                    case '-1':
                        PopupFact.alert("提示", "加入进货单失败");
                        break;
                    default:
                        break;
                }
                return;
            },
            function (data) {
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }



    $scope.pList = {
        Size: 1,
        Page: 7,
        commodity: [{
            Name: "Beats Solo2 无线头戴式耳机 - 黑色",
            Banner: [
                {
                    Img: "/images/productDetailsBanner.jpg"
                },
                {
                    Img: "/images/productDetailsBanner.jpg"
                },
                {
                    Img: "/images/productDetailsBanner.jpg"
                },
                {
                    Img: "/images/productDetailsBanner.jpg"
                }
            ]
        }],
        classList: [
            {
                Class: "产品详情",
                List: [
                    {
                        ImgBa: "/images/category/TB2d_2DhFXXXXaEXXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB22T99hFXXXXXwXFXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB24d6ehFXXXXbLXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2C_TmhFXXXXX_XpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2c7fdhFXXXXbjXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2e4rkhFXXXXaDXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2gkfAhFXXXXbDXXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2juTHhFXXXXagXXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2M1HfhFXXXXaMXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2qXTJhFXXXXX4XXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2UQYyhFXXXXb1XXXXXXXXXXXX_!!647482297.jpg"
                    }
                ]
            },
            {
                Class: "成交()",
                List: [

                ]
            },
            {
                Class: "评价()",
                List: [
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg", "/images/product/3.jpg", "/images/product/1.jpg", "/images/product/2.jpg", "/images/product/3.jpg", "/images/product/1.jpg", "/images/product/2.jpg", "/images/product/3.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                ],
                GetCompanyThear: function (p1) {
                    alert(0)
                    $http.success(function (data, status, headers, config) {
                        switch (data) {
                            default:
                                $scope.CompanyThearList = [];
                                var ThearList = [];
                                var j = 1;
                                if (data.length >= 5) {
                                    for (var i = 0; i < data.length; i++) {
                                        ThearList.push({
                                            "Id": data[i].ProviderStyleType_Id,
                                            "Picture": data[i].ProviderStyleType_Image
                                        });
                                        if (j == 3) {
                                            $scope.CompanyThearList.push({
                                                "List": ThearList
                                            });
                                            ThearList = [];
                                            j = 0;
                                        }
                                        j++;
                                    }
                                }
                                ThearList = [];
                                if (data.length % 5 != 0) {
                                    var count = data.length % 5;
                                    for (var ii = count; ii > 0; ii--) {
                                        ThearList.push({
                                            "Id": data[data.length - ii].ProviderStyleType_Id,
                                            "Picture": data[data.length - ii].ProviderStyleType_Image
                                        });
                                    }
                                    $scope.CompanyThearList.push({
                                        "List": ThearList
                                    });
                                }
                                $timeout(function () {
                                    $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
                                    if ($scope.CompanyThearList.length <= 2) {
                                        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(false);
                                    }
                                    else {
                                        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
                                    }
                                }, 300);
                                break;
                        }
                    }).error(function (data, status, headers, config) {
                        //alert("系统繁忙,请稍后重试！");   // 声明执行失败,即服务器返回错误  
                    });
                },
            },
            {
                Class: "进货保障",
                List: [
                    {
                        Description: "进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障"
                    }
                ]
            },

        ],

    };



    //
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;
            //重置滚动条高度
            $ionicScrollDelegate.resize();
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }



    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getDetailData($stateParams.Id);
        getParame($stateParams.Id);
        $ionicSlideBoxDelegate.update();
        if ($scope.basicImg.length < 3) {
            $ionicSlideBoxDelegate.loop(false);
        }
        else {
            $ionicSlideBoxDelegate.loop(true);
        }

        $timeout(function () {
            $ionicSlideBoxDelegate.slide(0);
        })

    });

    //加载数据事件
    // $scope.loadMore = function () {
    //     page++;
    //     getDetailData($stateParams.Id)
    // }

})

//分类
.controller('categoryController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact, loginJumpFact) {

    loginJumpFact.tokenJudge(location.href);
    //获取数据
    $scope.proList = [];

    function getCategory() {
        HttpFact.user.GET(domain + "/api/Product/getTypeList").then(
            function (data) {
                $scope.proList = JSON.parse(data);
            },

            function (data) {
                $scope.proList = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }


        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getCategory();
    });

    $scope.proEvent = {
        proIndex: 0,
        set: function (index) {
            $scope.proEvent.proIndex = index;
        },
        get: function (index) {
            return $scope.proEvent.proIndex == index;
        },

    }
})

//某品牌列表
.controller('categoryListController', function ($scope, $rootScope, $filter, $stateParams, HttpFact, loginJumpFact) {
    loginJumpFact.tokenJudge("categoryList");
    var brandData; //接收返回data数据 
    var pageCount; //总页数
    var pageNow; //當前頁
    $scope.noData = true;
    $scope.brandCollect = {
        array_1: []
    }
    function getData(current, count, provId, strW) {
        var submit = {
            current: current, //當前頁
            count: count, // 單頁條數
            provId: provId,
            strW: strW
        }
        HttpFact.user.POST(domain + "/api/Product/getProductList", submit).then(
            function (data) {
                brandData = JSON.parse(data)
                pageCount = Number(brandData.array_0[0].pageCount);
                pageNow = Number(brandData.array_0[0].pageNow);
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.brandCollect.array_1 = $scope.brandCollect.array_1.concat(brandData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.brandCollect.array_1 = $scope.brandCollect.array_1.concat(brandData.array_1);
                };

                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.brandCollect = {
                    array_1: []
                }
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(1, 6, 1, "and p_typeId=" + $stateParams.typeId + "and p_brandId=" + $stateParams.b_id);
    });

    //加载数据事件
    $scope.loadMore = function () {
        pageNow++;

    }

})

//资讯
.controller('informationController', function ($scope, $rootScope, $filter, $stateParams, HttpFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    var pageNow = 1; //当前页数
    var _size = 7;  //控制单页显示条数
    var jsonData; //接收返回data数据 
    var pageCount; //总页数
    $scope.noData = true;
    $scope.information = {
        array_1: [], //设置为空
    };

    function getInformation(type, current, count, strW) {
        //获取数据所需参数
        var submitData = {
            type: type,
            current: current, //当前页数
            count: count, //单页条数
            strW: strW,

        }

        HttpFact.user.POST(domain + "/api/Art/getList", submitData).then(

            function (data) {
                jsonData = JSON.parse(data);
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.information.array_1 = $scope.information.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.information.array_1 = $scope.information.array_1.concat(jsonData.array_1);
                };

                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.information = {
                    array_1: []
                };
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getInformation(1, pageNow, _size, "and 1 = 1");
    });

    //加载数据事件
    $scope.loadMore = function () {
        pageNow++;
        getInformation(1, pageNow, _size, "and 1 = 1");
    }
})

//咨讯详情
.controller('informationDetailController', function ($scope, $filter, $rootScope, $stateParams, HttpFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    function getInformationDetail(Id) {
        return HttpFact.user.GET(domain + "/api/Art/getDetail?id=" + Id).then(
            function (data) {
                $scope.informationDetail = JSON.parse(data);
            },
            function (data) {
                $scope.informationDetail = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            });
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getInformationDetail($stateParams.Id);
    });

})

//我的进货单
.controller('ordersController', function ($scope, $rootScope, $ionicPopup, filterFilter, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge("orders");
    $scope.input = {}

    function getShopping() {
        HttpFact.user.GET(domain + "/api/Order/shoppingCartList").then(
            function (data) {
                $scope.shopping = JSON.parse(data)
                // $scope.input.firm = $scope.shopping.s_companyName;
                 console.log($scope.shopping)

                //匹配公司
                var obj = filterFilter($scope.shopping, { s_companyName: $scope.input.firm }, true);
                $scope.companys = [];  //
                var type = []
                for (var i = 0; i < obj.length; i++) {
                    type.push(obj[i].s_companyName);
                }

                $scope.companys = unique(type);
                console.log(type)

            }
        )
    }
    //去重复
    function unique(arr) {
        var tmp = new Array();

        for (var m in arr) {
            tmp[arr[m]] = 1;
        }

        //再把键和值的位置再次调换
        var tmparr = new Array();

        for (var n in tmp) {
            tmparr.push(n);
        }

        return tmparr;
    }


    $scope.flag = { showDelete: false };

    $scope.delete = function (index1, index2) {
        //if ($scope.cartData[index1].goods.length <= 1) {
        //    $scope.cartData.splice(index1, 1);
        //}
        //else {
        //    $scope.cartData[index1].goods.splice(index2, 1);
        //};
        for (var i = 0; i < index2.length; i++) {
            if (index2[i].id == index1.id) {
                index2.splice(i, 1)
            }
        }
    };

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getShopping();
    });

})

//订单详情
.controller('ordersDetailController', function ($scope, $rootScope, $state, $ionicPopover, loginJumpFact) {
    loginJumpFact.tokenJudge("ordersDetail");

    $scope.proData = [
        {
            name: "深圳罗技电子科技有限公司",
            goods: [
                {
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
            ]
        }
    ]

    // //离开视图时执行事件
    // $scope.$on("$ionicView.beforeLeave", function () {
    //     $scope.closePrompt();

    // });

    // $scope.popover;

    $ionicPopover.fromTemplateUrl("/templates/model/proPrompt.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $scope.proPrompt = function () {
        $scope.popover.show();
    }
    $scope.closePrompt = function () {
        $scope.popover.hide();
    };

    $scope.proReplace = function () {
        $scope.popover.remove();
        $state.go("replaceGoods");
    }

    $scope.exchange = function () {
        $scope.popover.remove();
        $state.go("backGoods");
    }

    // $scope.$on("$destroy", function () {
    //     $scope.popover.remove();
    //     alert('0')
    // });
    // $scope.$on("$destroy", function () {
    //     $scope.ppopover.remove();
    // });

})

//退货详情
.controller('returnsDetailController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("returnsDetail");
    $scope.proData = [
            {
                name: "深圳罗技电子科技有限公司",
                goods: [
                    {
                        id: 1,
                        tradeName: "Beats Solo1 无线头戴式耳机",
                        amount: "￥" + 198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]
            }
    ]
})

//发票
.controller('invoiceController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("invoice");
    $scope.input = {}

    $scope.input.type = 1;
    $scope.active = function (key, value) {

        $scope.input[key] = value;
    }

    $scope.input.genre = 1;
    $scope.checked = function (key, value) {

        $scope.input[key] = value;
    }
})

//取货方式
.controller('pickupController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("pickup");
    $scope.input = {}
    $scope.pickData = [{

        name: "刘先生",
        phone: 13760269597,
        address: "深圳市南山区西丽街道南新花园A栋10H"
    }, {
        name: "陈先生",
        phone: 13760269597,
        address: "深圳市南山区西丽街道南新花园A栋10H"
    }]


    $scope.activeType = 0;
    $scope.is_pick = function (index) {

        $scope.activeType = index;
    }

    console.log($scope.activeType)

})

//评价详情
.controller('commentDetailController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("comment");
    $scope.input = {}
    $scope.proData = [
        {
            id: 3,
            tradeName: "Beats Solo1 无线头戴式耳机",
            amount: "￥" + 198.00,
            color: "黑色",
            edition: "普通版",
            comment: "还行吧！ 粉色是欧洲买的 用了一年了已经 和这次买的比较了一下 外包装方面国内的真心简易了好多哦！总的来说我觉得粉色质感较好 线的柔软度更好些看着也略宽略厚实一些 耳机的金属质感粉色更强些 音质方面么我这种门外汉估计也分辨不出来的?? 因为我是外貌协会的"
        }
    ]
})

//会员中心
.controller('userController', function ($scope, $rootScope, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    
    //获取用户信息
    function getUser() {

        HttpFact.user.GET(domain + "/api/User/getUserInfo").then(
            function (data) {
                $scope.user = data.res_Msg;
            }
        )
    }

    //判断用户是否已经绑定手机
    function getBindPhone() {
        HttpFact.user.GET(domain + "/api/User/Bind_Telephone?number="+1).then(
            function (data) {
                $scope.isBindPhone = data;
            }
        )
    }
    //判断用户是否已经绑定邮箱
    function getBindEmail() {
        HttpFact.user.GET(domain + "/api/User/Bind_Email?number="+2).then(
            function (data) {
                $scope.isBindEmail = data;
            }
        )
    }
    //判断是否实名验证
    function getReal() {
        HttpFact.user.GET(domain + "/api/User/Bind_Confirm?number="+3).then(
            function (data) {
                $scope.isReal = data;
            }
        )
    }
    //获取购物车商品个数
    function getNumber() {
        HttpFact.user.GET(domain + "/api/User/get_no_reader_message").then(
            function (data) {
                $scope.number = data.res_Msg;
                console.log(data)
            }
        )
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getReal();
        getBindEmail();
        getBindPhone();
        getNumber();
    });

    $scope.$on("$ionicView.afterEnter", function () {
        getUser();
    })
})

//会员中心 -- 待付款
.controller('pendingPaymentController', function ($scope, $rootScope, $ionicScrollDelegate, loginJumpFact, HttpFact) {
    $scope.input = {};
    $scope.payings = {
        list: []
    };
    var page = 1;
    var size = 7;
    $scope.noData = true;
    function getPendings(page,size) {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
        }
        HttpFact.user.POST(domain + "/api/Order/Wait_Pay", submit).then(
            function (data) {
                Data = JSON.parse(data.res_Msg);
                
                console.log(Data)
                pageCount = Number(Data[0].pageCount);
                pageNow = Number(Data[0].pageNow);

                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.payings.list = $scope.payings.list.concat(Data[0].list);
                    $scope.noData = false;
                    console.log($scope.payings.list)
                }
                else {
                    $scope.payings.list = $scope.payings.list.concat(Data[0].list);
                    console.log($scope.payings.list)
                };
                
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.payings = {
                    list: []
                };
            }
        )
    }
    
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getPendings(page,size)
    });
    
})

//会员中心--待发货
.controller('shippedController',function ($scope, $rootScope, $ionicScrollDelegate, loginJumpFact, HttpFact){
    $scope.input = {}
})

//会员中心--待收货
.controller('waitReceiptController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge("waitReceipt");
    $scope.input = {};
    $scope.receipts = [];
    var page = 1;
    var size = 7;
    $scope.noData = true;
    function getReceipt() {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
        }
        HttpFact.user.POST(domain + "/api/Order/Wait_Goods", submit).then(
            function (data) {
                Data = JSON.parse(data.res_Msg);
                pageCount = Number(Data[0].pageCount);
                pageNow = Number(Data[0].pageNow);

                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.receipts = $scope.receipts.concat(Data[0].list);
                    $scope.noData = false;
                    console.log($scope.receipts)
                }
                else {
                    $scope.receipts = $scope.receipts.concat(Data[0].list);
                    console.log($scope.receipts)
                };
                
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.receipts = []
            }
        )
    }

    // 确认弹出框
    $scope.showConfirm = function () {
        $ionicPopup.confirm({
            title: "是否确认收货",
            //template: "你确定要吃我的冰淇淋吗？"
            cancelText: "取消",
            cancelType: "button-light",
            okText: "确认",
            okType: "button-Orange",
        })
    };
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getReceipt(page,size)
    });
})

//会员中心--待评价
.controller('waitEvaluationController',function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, loginJumpFact, HttpFact){
    $scope.input = {}
    $scope.opinions = [];
    var page = 1;
    var size = 7;
    $scope.noData = true;
    function getPendings(page,size) {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
        }
        HttpFact.user.POST(domain + "/api/Order/Wait_Comment", submit).then(
            function (data) {
                Data = JSON.parse(data.res_Msg);
                console.log(Data)
                pageCount = Number(Data[0].pageCount);
                pageNow = Number(Data[0].pageNow);

                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.opinions = $scope.opinions.concat(Data[0].list);
                    $scope.noData = false;
                    console.log($scope.opinions)
                }
                else {
                    $scope.opinions = $scope.opinions.concat(Data[0].list);
                    console.log($scope.opinions)
                };
                
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.opinions = [];
            }
        )
    }
    
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getPendings(page,size)
    });
})


//会员中心--评价
.controller('opinionController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, loginJumpFact, HttpFact){
    $scope.input = {}
    $scope.proData = [
            {
                name: "深圳罗技电子科技有限公司",
                goods: [
                    {
                        id: 1,
                        tradeName: "Beats Solo1 无线头戴式耳机",
                        amount: "￥" + 198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]
            }
    ]

})
//会员中心--账户设置
.controller('basicDataController', function ($scope, $rootScope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, loginJumpFact, ModalFact, HttpFact, PopupFact) {
    loginJumpFact.tokenJudge("basicData");
    $scope.input = {}
    $scope.select = {

    }
    $scope.input = { Sex: 1};
    $scope.single_check = function (name, value) {

        $scope.input[name] = value;
    }

    //身份选择
    $scope.identities = [
       {
           name: '企业'
       }, {
           name: '个人'
       }, {
           name: '个体经营'
       }, {
           name: '社会团体'
       }, {
           name: '事业单位'
       }, {
           name: '其他'
       }
    ]

    $scope.Identity = "";

    if ($scope.input.Identity == "" || $scope.input.Identity == null) {
        $scope.input.Identity = "请输入您的身份";
    }

    //打开身份模态框
    $scope.identity_active = function () {
        ModalFact.show($scope, "/templates/model/province.html");
        $ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    }
    //身份事件
    $scope.identityEvent = function (val) {
        $scope.Identity += val;
        $scope.input.Identity = "";
        $scope.input.Identity = $scope.Identity;
        $scope.Identity = "";
        $scope.closeok();
    };

    //（未完成地址选取）关闭地址模态框
    $scope.close = function () {
        $scope.Identity = "";
        ModalFact.clear();
    };

    $scope.closeok = function () {
        ModalFact.clear();
        // $ionicSlideBoxDelegate.$getByHandle("provinceHandle").slide(0);
    };

    //判断身份证号码
    $scope.checkId = function () {
        if (judgeFact.checkIdCard($scope.input.checkIdCard) != "") {
            return;
        }
    }


    //地址选择
    $scope.address = "";
    $scope.cityList = cityList;
    $scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";

        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (val, key) {
        $scope.input.Province = val;
        // $scope.input.s_provId = JSON.stringify(key);
        for (var i = 0; i < $scope.cityList.length; i++) {
            if ($scope.cityList[i].p == val) {
                $scope.address += val;
                $scope.citys = $scope.cityList[i].c;
                break;
            };
        };
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (val) {
        $scope.input.City = val
        for (var i = 0; i < $scope.citys.length; i++) {
            if ($scope.citys[i].n == val) {
                if ($scope.citys[i].a == undefined) {
                    $scope.address += val;
                    $scope.input.Area = "";
                    $scope.select.City = "";
                    $scope.select.City = $scope.address;
                    $scope.address = "";
                    $scope.cityOkModal();
                }
                else {
                    $scope.address += val;
                    $scope.areas = $scope.citys[i].a;
                    $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                };
                break;
            };
        };
    };

    //区（县）事件
    $scope.areaEvent = function (val) {
        $scope.input.Area = val
        $scope.address += val;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };

    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
    }

    //获取注册信息
    function getSigninInfo() {
        HttpFact.user.GET(domain + "/api/User/getUserInfo").then(
            function (data) {
                $scope.input.Nick = data.res_Msg[0].nick;
                $scope.input.Sex =  Number(data.res_Msg[0].sex);
                $scope.input.Identity = data.res_Msg[0].identity;
                $scope.input.Email = data.res_Msg[0].email;
                $scope.input.Mobile = data.res_Msg[0].phone;
                $scope.input.Telephone = data.res_Msg[0].telephone;
                $scope.input.Province = data.res_Msg[0].storeProv;
                $scope.input.City = data.res_Msg[0].storeCity;
                $scope.input.Area = data.res_Msg[0].storeDist;
                $scope.input.Address = data.res_Msg[0].storeDetailAddr;
                $scope.input.Postcode = data.res_Msg[0].postcode;
                $scope.select.City = data.res_Msg[0].storeProv + data.res_Msg[0].storeCity + data.res_Msg[0].storeDist;
                
            }
        )
    }

    //保存修改的账户信息
    $scope.save_action = function () {
        if ($scope.input.Nick == "" || $scope.input.Nick == null) {
            PopupFact.alert("提示", "昵称不能为空");
            return false;
        }

        HttpFact.user.POST(domain + "/api/User/updateUserInfo", JSON.stringify($scope.input)).then(
            function (data) {
                if (data.res_Code == "1") {
                    PopupFact.alert("提示", "修改账户基本信息成功!", "$state.go('accountSetting')")
                }
                else {
                    PopupFact.alert("提示", "修改账户基本信息失败")
                }
                console.log(data)
            }
        )
    }
    
    
     //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getSigninInfo()
    });
})

//会员中心--手机绑定
.controller('phoneBindingController', function ($scope, PopupFact, $location) {
    $scope.input = {
        phone: '',
        Obtain: ''
    }

    //验证码
    var Obtainlength = '';

    //绑定按钮点击
    $scope.Binding = function () {
        if ($scope.input.phone == "" || $scope.input.phone == null) {
            PopupFact.alert("提示", "请输入手机号码");
            return false;
        };
        //判断手机头
        if (/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.input.phone) == false) {
            PopupFact.alert("提示", "输入的手机号不正确！");
            return false;
        }

        if ($scope.input.Obtain == "" || $scope.input.Obtain == null) {
            PopupFact.alert("提示", "请输入验证码");
            return false;
        };

        if ($scope.input.Obtain != Obtainlength) {
            PopupFact.alert("提示", "验证码错误！！！");
            return false;
        };
        PopupFact.alert("提示", "手机绑定成功");
        $location.path('/accountSecurity');
        return true;
    }

    //获取验证码
    $scope.Obtain = function () {
        PopupFact.alert("提示", "已向您的手机发送信息");
        return true;
    }

})

//会员中心--邮箱绑定
.controller('emailBindingController', function ($scope, PopupFact, $location) {

    $scope.input = {
        email: '',
        Obtain: ''
    }

    //验证码
    var Obtainlength = '';

    //绑定按钮点击
    $scope.Binding = function () {
        if ($scope.input.email == "" || $scope.input.email == null) {
            PopupFact.alert("提示", "请输入邮箱");
            return false;
        };
        //判断邮箱
        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($scope.input.email) == false) {
            PopupFact.alert("提示", "输入的邮箱不正确！");
            return false;
        }

        if ($scope.input.Obtain == "" || $scope.input.Obtain == null) {
            PopupFact.alert("提示", "请输入验证码");
            return false;
        };

        if ($scope.input.Obtain != Obtainlength) {
            PopupFact.alert("提示", "验证码错误！！！");
            return false;
        };

        PopupFact.alert("提示", "邮箱绑定成功");
        $location.path('/accountSecurity');
        return true;
    }

    //获取验证码
    $scope.Obtain = function () {
        PopupFact.alert("提示", "已向您的邮箱发送信息");
        return true;
    }

})

//会员中心--设置头像
.controller('avatarSettingsController', function ($scope, $rootScope, HttpFact, loginJumpFact) {
    loginJumpFact.tokenJudge("avatarSettings");
})

.controller('uploadAvatarController', function ($scope) {

})

//账户设置-收货地址管理
.controller('addressManageController', function ($scope, $state, $rootScope, LoadingFact, $timeout, HttpFact, ModalFact, PopupFact, loginJumpFact) {
    loginJumpFact.tokenJudge("addressManage");
    $scope.input = {}
    $scope.input.deleteId = '';

    //地址列表
    function getAddressList() {
        HttpFact.user.GET(domain + "/api/User/addressList").then(
            function (data) {
                $scope.addresses = JSON.parse(data);
            }
        )
    }

    //设置默认位置为顶部
    // function render() {
    //     var result = [];
    //     for (var i = 0; i < $scope.addresses.length; i++) {
    //         if ($scope.addresses[i].a_isDefault == "True") {
    //             //result.push($scope.addresses[i].a_isDefault);
    //             //delete $scope.addresses;
    //             var Item = $scope.addresses[i];
    //             $scope.projectList.splice(i, 1);
    //             $scope.projectList.splice(0, 0, Item);
    //         }
    //     }
    // }

    //滑动删除事件
    $scope.flag = { showDelete: false };
    //滑动删除
    $scope.remove = function (value, key) {

        HttpFact.user.GET(domain + "/api/User/addressDelete?id=" + value).then(
            function (data) {
                if (data == '1') {
                    $scope.addresses.splice($scope.addresses.indexOf(key), 1);
                    getAddressList()
                }
                else {
                    PopupFact.alert("提示", "删除失败");
                    location.href = "/addressManage";
                }
            }

        )
    };

    //设置默认
    $scope.activeType = 0;
    $scope.is_pick = function (value) {
        $scope.activeType = value;
    }

    $scope.default_action = function (value) {

        HttpFact.user.GET(domain + "/api/User/addressDefault?id=" + value).then(
            function (data) {
                if (data == '1') {
                    $scope.activeType = value;
                }
                //for (var i = 0; i < $scope.addresses.length; i++) {
                //    if ($scope.addresses[i].a_id == value) {
                //        var Item = $scope.addresses[i];
                //        $scope.addresses.splice(i, 1);
                //        $scope.addresses.unshift({
                //            a_id:Item.a_id,
                //            a_name: Item.a_name,
                //            a_phone: Item.a_phone,
                //            a_prov: Item.a_prov,
                //            a_city: Item.a_city,
                //            a_dist: Item.a_dist,
                //            a_detailAddr: Item.a_detailAddr

                //        });
                //    }
                //}


                $scope.addressDefault = JSON.parse(data);
                console.log($scope.addressDefault)
            }
        )
        $timeout(function () {
            location = location;
        }, 500)


    }


    $scope.$on("$ionicView.afterEnter", function () {
        getAddressList();

    })


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {

    });

})

//账户设置-地址管理 -- 添加新地址
.controller('newAddressController', function ($scope, $rootScope, $state, $timeout, HttpFact, $ionicSlideBoxDelegate, $ionicScrollDelegate, ModalFact, PopupFact, loginJumpFact) {
    loginJumpFact.tokenJudge("newAddress");
    $scope.input = {
        isDefault: true,
    }
    $scope.select = {

    }
    $scope.addresses = [];


    $scope.is_agree = function () {
        $scope.input.isDefault = !$scope.input.isDefault;
    };


    //地址选择
    $scope.address = "";
    $scope.cityList = cityList;
    $scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (val) {
        $scope.input.s_storeProv = val;
        for (var i = 0; i < $scope.cityList.length; i++) {
            if ($scope.cityList[i].p == val) {
                $scope.address += val;
                $scope.citys = $scope.cityList[i].c;
                break;
            };
        };
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (val) {
        $scope.input.s_storeCity = val
        for (var i = 0; i < $scope.citys.length; i++) {
            if ($scope.citys[i].n == val) {
                if ($scope.citys[i].a == undefined) {
                    $scope.address += val;
                    $scope.select.City = "";
                    $scope.select.City = $scope.address;
                    $scope.address = "";
                    $scope.cityOkModal();
                }
                else {
                    $scope.address += val;
                    $scope.areas = $scope.citys[i].a;
                    $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                };
                break;
            };
        };
    };

    //区（县）事件
    $scope.areaEvent = function (val) {
        $scope.input.s_storeDist = val
        $scope.address += val;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };

    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
    }

    //添加收货地址
    $scope.add_address = function () {
        HttpFact.user.POST(domain + "/api/User/addressAdd", $scope.input).then(
            function (data) {
                if (data == "1") {
                    PopupFact.alert("提示", "添加成功", "$state.go('addressManage')")
                }
                else {
                    PopupFact.alert("提示", "添加失败")
                }
            },
            function (data) {
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {

    });

    $scope.$on("$ionicView.afterEnter", function () {

    })
})

//修改地址
.controller('changeAddressController', function ($scope, $rootScope, ModalFact, $state, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, $stateParams, HttpFact, PopupFact, loginJumpFact) {

    loginJumpFact.tokenJudge(location.href);
    $scope.select = {}

    $scope.input = {
        id: $stateParams.Id,
        s_name: '',
        s_phone: '',
        s_telephone: '',
        s_storeProv: '',
        s_storeCity: '',
        s_storeDist: '',
        s_storeDetailAddr: '',
        s_postcode: '',
    }

    //地址选择
    $scope.address = '';
    $scope.cityList = cityList;
    $scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";

        ModalFact.clear();

    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (val) {
        $scope.input.s_storeProv = val;

        for (var i = 0; i < $scope.cityList.length; i++) {
            if ($scope.cityList[i].p == val) {
                $scope.address += val;
                $scope.citys = $scope.cityList[i].c;
                break;
            };
        };
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (val) {
        $scope.input.s_storeCity = val
        for (var i = 0; i < $scope.citys.length; i++) {
            if ($scope.citys[i].n == val) {
                if ($scope.citys[i].a == undefined) {
                    $scope.address += val;
                    $scope.input.s_storeDist = '';
                    $scope.select.City = "";
                    $scope.select.City = $scope.address;
                    $scope.address = "";
                    $scope.cityOkModal();
                }
                else {
                    $scope.address += val;
                    $scope.areas = $scope.citys[i].a;
                    $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                };
                break;
            };
        };
    };

    //区（县）事件
    $scope.areaEvent = function (val) {
        $scope.input.s_storeDist = val
        $scope.address += val;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };

    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
    }

    //提交地址修改数据
    $scope.Edit = function () {
        HttpFact.user.POST(domain + "/api/User/addressEdit", $scope.input).then(
            function (data) {
                $scope.editData = JSON.parse(data);
                if (data == '1') {
                    $state.go('addressManage')
                }
            },
            function (data) {
                $scope.editData = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )

    }
    //获取地址详情
    function getAddressDetail(id) {
        HttpFact.user.GET(domain + "/api/User/addressDetail?id=" + id).then(
            function (data) {
                $scope.data = JSON.parse(data);
                console.log($scope.data)
                $scope.input.s_name = $scope.data[0].a_name;
                $scope.input.s_phone = $scope.data[0].a_phone;
                $scope.input.s_telephone = $scope.data[0].a_telephone;
                $scope.input.s_storeDetailAddr = $scope.data[0].a_detailAddr;
                $scope.input.s_postcode = $scope.data[0].a_postCode;
                $scope.input.s_storeProv = $scope.data[0].a_prov;
                $scope.input.s_storeCity = $scope.data[0].a_city;
                $scope.input.s_storeDist = $scope.data[0].a_dist;
                $scope.select.City = $scope.data[0].a_prov + $scope.data[0].a_city + $scope.data[0].a_dist;
            }
        )
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getAddressDetail($stateParams.Id)
    });
})


//会员中心--全部订单
.controller('allOrdersController', function ($scope, $rootScope, $ionicPopup) {
    //顶部订单按钮
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;

        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }
    // 确认收货弹出框
    $scope.showConfirm = function () {
        $ionicPopup.confirm({
            title: "是否确认收货",
            cancelText: "取消",
            cancelType: "button-light",
            okText: "确认",
            okType: "button-Orange",
        })
    };
    // 删除订单弹出框
    $scope.deleteOrder = function () {
        $ionicPopup.confirm({
            title: "是否删除订单",
            cancelText: "取消",
            cancelType: "button-light",
            okText: "确认",
            okType: "button-Red",
        })
    };
})

//会员中心--进销存
.controller('psdSystemController', function ($scope, $rootScope, $ionicPopup, ModalFact) {
    //顶部订单按钮
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;

        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    };

    $scope.tsEvent = function () {
        $scope.ts = !$scope.ts;
    }
})

//立即评价
.controller('reviewsController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("reviews");
    $scope.proData = [
            {
                name: "深圳罗技电子科技有限公司",
                goods: [
                    {
                        id: 1,
                        tradeName: "Beats Solo1 无线头戴式耳机",
                        amount: "￥" + 198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]
            }
    ]
})

//退货操作
.controller('backGoodsController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("backGoods");
    $scope.input = {}
    $scope.proDatas = [
        {
            name: "深圳罗技电子科技有限公司",
            products: [
                {
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机",
                    amount: "￥" + 1980.00,
                    color: "黑色",
                    edition: "普通版",
                    number: 5,
                    Check: false
                }, {
                    id: 2,
                    tradeName: "Apple 数据闪充数据线",
                    amount: "￥" + 1980.00,
                    color: "黑色",
                    edition: "普通版",
                    Check: false
                }
            ]
        }
    ]

    //是否全选
    $scope.check_all = function () {



        // for(var i=0;i<$scope.proDatas[0].products.length;i++){

        //    $scope.proDatas[0].products[i].Check = !$scope.proDatas[0].products[i].Check;

        // }

        // prodata.Check = !prodata.Check;

        if ($scope.product_size == $scope.proDatas[0].products.length) {
            $scope.proDatas[0].products.map(function (c) {
                c.Check = false
                return c;
            });
            return;
        }

        $scope.proDatas[0].products.map(function (c) {
            c.Check = true
            return c;
        });


    }

    //单选
    $scope.toggle = function (pro) {
        return pro.Check = !pro.Check;
    }

    //计算总数量
    $scope.get_total = function () {
        var total = 0;
        $scope.product_size = 0;
        angular.forEach($scope.proDatas[0].products, function (value, key) {
            if (value.Check) {
                $scope.product_size++;
                total += 1;
            }
            console.log(key)
        });
        return total;
    };

})

//favoriteController收藏确认
.controller('favoriteController', function ($scope, $rootScope, $state, $ionicPopover, loginJumpFact) {
    loginJumpFact.tokenJudge("favorite");
    $ionicPopover.fromTemplateUrl("/templates/model/confirm.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $scope.confirm = function () {
        $scope.popover.show();

    }
    $scope.closeConfirm = function () {
        $scope.popover.hide();
    };

})

//登录
.controller('loginController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact, privilegeFact, getQueryStringFact) {
    //基础设置


    $scope.input = {
        account: '',
        pwd: '',
        codeId: '',
        codeValue: '',
        fingerprint: new Fingerprint().get() //获取游览器指纹
    }


    //数据获取
    //获取图片验证码
    function getcode() {
        HttpFact.get(domain + "/api/verify/getCode").then(
            function (data) {
                $scope.codeData = data;
                $scope.input.codeId = $scope.codeData.codeId;
                // console.log(data)
            }
        )
    }
    $scope.code_active = function () {
        HttpFact.get(domain + "/api/verify/getCode").then(
            function (data) {
                $scope.codeData = data;
                $scope.input.codeId = $scope.codeData.codeId;
                console.log(data)
            }
        )
    }


    $scope.signin_action = function () {

        // if (judgeFact.mob($scope.input.account) == false) {
        //   return false;
        // }
        // if (judgeFact.email($scope.input.pwd) == false) {
        //   return false;
        // }


        if ($scope.input.account == "" || $scope.input.account == null) {
            PopupFact.alert("提示", "用户名不能为空");
            return false;
        };

        if ($scope.input.pwd == "" || $scope.input.pwd == null) {
            PopupFact.alert("提示", "密码不能为空");
            return false;
        };

        if ($scope.input.codeValue == "" || $scope.input.codeValue == null) {
            PopupFact.alert("提示", "验证码不能为空");
            return false;
        };

        HttpFact.post(domain + "/api/User/login", $scope.input).then(
        function (data) {

            switch (data) {
                case '0':
                    PopupFact.alert("提示", "用户名或密码输入有误");
                    break;
                case '-1':
                    PopupFact.alert("提示", "您的账号违反规定，已被禁用，请联系工作人员!");
                    break;
                case '-2':
                    PopupFact.alert("提示", "用户名不能为空");
                    break;
                case '-3':
                    PopupFact.alert("提示", "密码不能为空");
                    break;
                case '-4':
                    PopupFact.alert("提示", "您输入的验证码有误");
                    break;
                case '-5':
                    PopupFact.alert("提示", "获取不到信息，请重新登录");
                    break;
                default:
                    localStorage.setItem("User-Token", data);
                    console.log(localStorage.getItem("User-Token"))
                    $scope.url = getQueryStringFact.get('url')

                    if ($scope.url == '' || $scope.url == null) {
                        $state.go("tabs.home");
                    }
                    else {
                        location.href = $scope.url;
                    }
                    break;
            };

        },
        function (data) {
            PopupFact.alert("提示", "登录失败");
        });

    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getcode();
        //if (localStorage.getItem("User-Token") != undefined && localStorage.getItem("User-Token") != '') {

        //};
    });


})

//注册
.controller('signupController', function ($scope, $rootScope, $state, $ionicHistory, $timeout, $ionicSlideBoxDelegate, $ionicActionSheet, HttpFact, ModalFact, judgeFact, PopupFact, $ionicScrollDelegate, $ionicSlideBoxDelegate) {


    $scope.input = {
        account: '',
        pwd: '',
        s_name: '',
        s_email: '',
        codeEId: '',
        codeEValue: '',
        s_phone: '',
        s_idCard: '',
        s_provId: '',
        s_storeName: '',
        s_storeProv: '',
        s_storeCity: '',
        s_storeDist: '',
        s_storeDetailAddr: '',
        s_identity: ''
    }

    $scope.select = {

    }



    //获取验证码
    $scope.countdown = {
        // count: "5",
        message: "获取验证码",
    }
    $scope.countdown.callback = function (EmailNum) {

        HttpFact.get(domain + "/api/verify/getEmailCodeId", { EmailNum: $scope.input.s_email }).then(
            function (data) {
                if (data == '-1') {
                    PopupFact.alert("提示", "邮箱格式有误");
                }
                else {
                    $scope.countdown.reset = false;
                }
                $scope.input.codeEId = data;
            }
        )

    }

    //验证码校验
    $scope.check_code = function (codeEId, codeEValue) {
        HttpFact.get(domain + "/api/verify/checkEmailCode", { codeEId: $scope.input.codeEId, codeEValue: $scope.input.code_value }).then(
            function (data) {
                if (data == '0') {
                    PopupFact.alert("提示", "输入验证码有误")
                }
                return;
            }
        )
    }

    //用户名校验
    function check_account() {
        HttpFact.get(domain + "/api/verify/verifyLoginName", { name: $scope.input.account }).then(
            function (data) {
                switch (data) {
                    case '-1':
                        PopupFact.alert("提示", "该用户名已存在");
                        break;
                    case '-2':
                        PopupFact.alert("提示", "用户名不能为手机号码或邮箱号码");

                        break;
                    case '-3':
                        PopupFact.alert("提示", "用户名只能数字或字母");
                        break;
                    default:
                        break;
                }
                return;
            }
        )
    }
    //用户名校验
    $scope.check_name = function (name) {
        HttpFact.get(domain + "/api/verify/verifyLoginName", { name: $scope.input.account }).then(
            function (data) {
                switch (data) {
                    case '-1':
                        PopupFact.alert("提示", "该用户名已存在");
                        break;
                    case '-2':
                        PopupFact.alert("提示", "用户名不能为手机号码或邮箱号码");

                        break;
                    case '-3':
                        PopupFact.alert("提示", "用户名只能数字或字母");
                        break;
                    default:
                        break;
                }
                return;
            }
        )
    }

    //邮箱验证
    $scope.check_email = function (name) {
        if (judgeFact.email($scope.input.s_email) == false) {
            return false;
        }
    }

    //密码确认
    $scope.check_pwd = function () {
        if ($scope.input.confirm_pwd != $scope.input.pwd) {
            PopupFact.alert("提示", "密码不一致");
            return false;
        };
    }
    //选择性别
    $scope.input = { gender: "先生" };
    $scope.single_check = function (name, value) {

        $scope.input[name] = value;
    }

    //地址选择
    $scope.address = "";
    $scope.cityList = cityList;
    $scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";

        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        $scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (val, key) {

        $scope.input.s_storeProv = val;
        $scope.input.s_provId = JSON.stringify(key);
        for (var i = 0; i < $scope.cityList.length; i++) {
            if ($scope.cityList[i].p == val) {
                $scope.address += val;
                $scope.citys = $scope.cityList[i].c;
                break;
            };
        };
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (val) {
        $scope.input.s_storeCity = val
        for (var i = 0; i < $scope.citys.length; i++) {
            if ($scope.citys[i].n == val) {
                if ($scope.citys[i].a == undefined) {
                    $scope.address += val;
                    $scope.select.City = "";
                    $scope.select.City = $scope.address;
                    $scope.address = "";
                    $scope.cityOkModal();
                }
                else {
                    $scope.address += val;
                    $scope.areas = $scope.citys[i].a;
                    $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                };
                break;
            };
        };
    };

    //区（县）事件
    $scope.areaEvent = function (val) {
        $scope.input.s_storeDist = val
        $scope.address += val;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };

    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
    }

    //身份选择
    $scope.identities = [
       {
           name: '企业'
       }, {
           name: '个人'
       }, {
           name: '个体经营'
       }, {
           name: '社会团体'
       }, {
           name: '事业单位'
       }, {
           name: '其他'
       }
    ]

    $scope.Identity = "";

    if ($scope.input.s_identity == "" || $scope.input.s_identity == null) {
        $scope.input.s_identity = "请输入您的身份";
    }

    //打开身份模态框
    $scope.identity_active = function () {
        ModalFact.show($scope, "/templates/model/province.html");
        $ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    }
    //身份份事件
    $scope.identityEvent = function (val) {
        $scope.Identity += val;
        $scope.input.s_identity = "";
        $scope.input.s_identity = $scope.Identity;
        $scope.Identity = "";
        $scope.closeok();
    };

    //（未完成地址选取）关闭地址模态框
    $scope.close = function () {
        $scope.Identity = "";
        ModalFact.clear();
    };

    $scope.closeok = function () {
        ModalFact.clear();
        // $ionicSlideBoxDelegate.$getByHandle("provinceHandle").slide(0);
    };
    //选择身份
    if ($scope.input.s_storeProv == "" || $scope.input.s_storeProv == null) {
        $scope.input.s_storeProv = "请选择";
    }

    $scope.checkId = function () {
        if (judgeFact.checkIdCard($scope.input.checkIdCard) != "") {
            return;
        }
    }
    //提交注册信息
    $scope.signup_action = function () {
        if ($scope.input.account == "" || $scope.input.account == null) {
            PopupFact.alert("提示", "用户名不能为空");
            return false;
        };
        check_account();
        if ($scope.input.pwd == "" || $scope.input.pwd == null) {
            PopupFact.alert("提示", "密码不能为空");
            return false;
        };
        if ($scope.input.confirm_pwd == "" || $scope.input.confirm_pwd == null) {
            PopupFact.alert("提示", "确认密码不能为空");
            return false;
        };
        if ($scope.input.confirm_pwd != $scope.input.pwd) {
            PopupFact.alert("提示", "密码不一致");
            return false;
        };
        if ($scope.input.s_name == "" || $scope.input.s_name == null) {
            PopupFact.alert("提示", "真实姓名不能为空");
            return false;
        };

        if (judgeFact.email($scope.input.s_email) == false) {
            return false;
        }
        if ($scope.input.codeEValue == "" || $scope.input.codeEValue == null) {
            PopupFact.alert("提示", "验证码不能为空");
            return false;
        };
        if (judgeFact.mob($scope.input.s_phone) == false) {
            return false;
        }
        if (judgeFact.checkIdCard($scope.input.checkIdCard) != "") {
            PopupFact.alert("提示", "身份证号码输入有误");
            return;
        }
        if ($scope.input.s_identity == "" || $scope.input.s_identity == null || $scope.input.s_identity == "请选择") {
            PopupFact.alert("提示", "请选择身份类型");
            return false;
        };
        if ($scope.select.City == "" || $scope.select.City == null || $scope.select.City == "请选择") {
            PopupFact.alert("提示", "请选择地址");
            return false;
        };
        if ($scope.input.s_storeDetailAddr == "" || $scope.input.s_storeDetailAddr == null) {
            PopupFact.alert("提示", "请输入详细地址");
            return false;
        };
        HttpFact.post(domain + "/api/User/registe", $scope.input).then(
            function (data) {
                console.log($scope.input)
                console.log(data)
                if (data == '1') {
                    PopupFact.alert("提示", "注册成功", "$state.go('login')");

                }
                else {
                    PopupFact.alert("提示", "注册失败", "$state.go('signup')");
                }
            }
        )

    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        check_account();
    });

})