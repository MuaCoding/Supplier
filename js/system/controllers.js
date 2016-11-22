angular.module('DS.controllers', [])

//首页
.controller('homeController', function ($scope, $filter, $rootScope, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout, HttpFact, PopupFact, privilegeFact,ModalFact) {

    ////////获取热销产品数据//////////
    var page = 1;
    var size = 4;
    $scope.noData = true;
    $scope.hotProduct = {
        array_1: []
    }
    
    function getData (current,count,provId,strW,orderby) {
        var submitData = {
            current: current, //当前页数
            count: count, //单页条数
            provId: provId,
            strW: "",
            orderby: "PD.p_saleNum DESC,"
        }
        HttpFact.post(domain + "/api/Product/getProductList",submitData).then(
            function (data){
                jsonData = JSON.parse(data);
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);
                console.log(jsonData)
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
            }
        )
    }

    /////轮播
    //清除缓存，否则轮播报错
    $rootScope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.banners = [];
    function getBanner(provId,count) {
        var submit = {
            provId: provId,
            count:count,
        }
        HttpFact.post(domain + "/api/Art/getBanner",submit).then(
            function (data) {
                $scope.banners = JSON.parse(data);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data){
                $scope.banners = [];
            }
        )
    }


    /////新品上架
    $scope.newProducts = [];
    function getNew (current,count,provId,strW,orderby){
        var submitData = {
            current: current, //当前页数
            count: count, //单页条数
            provId: provId,
            strW: strW,
            orderby: orderby
        }
        HttpFact.post(domain + "/api/Product/getProductList",submitData).then(
            function (data) {
                $scope.newProducts = JSON.parse(data);
                console.log($scope.newProducts)

                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data){
                $scope.newProducts = []; 
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
        getData(page, size, 1,0, "");
        getBanner(1,3);
        getNew(1, 3, 1 ,"" ,"PD.p_saleNum DESC,")
    });

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getData(page, size,1, 0, "");
        getBanner(1,3);
    }



})


//产品
.controller('productListController', function ($scope, ModalFact) {
    
    $scope.screenClick = function () {
        ModalFact.show($scope, "/templates/model/pd-Screening.html");
    };
    $scope.closeModal = function () {
        ModalFact.hide();
    };

    //离开视图时执行事件
    $scope.$on("$ionicView.beforeLeave", function () {
        ModalFact.hide();
    });

    $scope.AllModel = {
        BrandModel: [
                {
                    Id: null,
                    TypeName: "三星",
                    Check: false
                },
                {
                    Id: null,
                    TypeName: "华为",
                    Check: false
                },
                {
                    Id: null,
                    TypeName: "小米",
                    Check: false
                },
                {
                    Id: null,
                    TypeName: "摩托罗拉",
                    Check: false
                },
                {
                    Id: null,
                    TypeName: "苹果",
                    Check: false
                },
                {
                    Id: null,
                    TypeName: "魅族",
                    Check: false
                },
        ],
        TypeModel: [
        {
            Id: null,
            TypeName: "移动电源",
            Check: false
        },
        {
            Id: null,
            TypeName: "手机壳",
            Check: false
        },
        {
            Id: null,
            TypeName: "耳机线",
            Check: false
        },
        {
            Id: null,
            TypeName: "车载支架",
            Check: false
        },
        {
            Id: null,
            TypeName: "贴膜",
            Check: false
        },
        {
            Id: null,
            TypeName: "除尘套装",
            Check: false
        },
        ],
        NumberModel: [
        {
            Id: null,
            TypeName: "1~99件",
            Check: false
        },
        {
            Id: null,
            TypeName: "≥100件",
            Check: false
        },
        {
            Id: null,
            TypeName: "≥999件",
            Check: false
        },
        ]
    };

    $scope.SetCheck = function (v1, v2) {
        for (var i = 0; i < v2.length; i++) {
            v2[i].Check = false;
        }
        v1.Check = !v1.Check;
    };
})
.controller('productDetailsController', function ($scope, $ionicPopover, $ionicScrollDelegate, $stateParams, $state, $rootScope, HttpFact, judgeFact, PopupFact) {
    //产品规格
    // $scope.AllModel = {
    //     ColorModel: [
    //         {
    //             Id: null,
    //             TypeName: "红色",
    //             Check: false
    //         },
    //         {
    //             Id: null,
    //             TypeName: "白色",
    //             Check: false
    //         },
    //         {
    //             Id: null,
    //             TypeName: "黑色",
    //             Check: false
    //         },
    //     ],
    //     VersionModel: [
    //        {
    //            Id: null,
    //            TypeName: "普通版",
    //            Check: false
    //        },
    //        {
    //            Id: null,
    //            TypeName: "尊贵版",
    //            Check: false
    //        },
    //        {
    //            Id: null,
    //            TypeName: "旗舰版",
    //            Check: false
    //        },
    //        {
    //            Id: null,
    //            TypeName: "限量版",
    //            Check: false
    //        },
    //     ],
    //     PriceModel: [
    //        {
    //            Id: null,
    //            TypeName: "1~99件",
    //            TypePrice: "￥230.00",
    //            Check: false
    //        },
    //        {
    //            Id: null,
    //            TypeName: "≥100件",
    //            TypePrice: "￥230.00",
    //            Check: false
    //        },
    //        {
    //            Id: null,
    //            TypeName: "≥999件",
    //            TypePrice: "￥230.00",
    //            Check: false
    //        },
    //     ],
    // };


    //商品详情(基本包)
    $scope.basicData = []
    function getDetailData (Id){
        HttpFact.get(domain + "/api/Product/getProductDetail", {Id: Id}).then(
            function(data){
                $scope.basicData = JSON.parse(data);
                console.log($scope.basicData)
            },
            function (data) {
               $scope.basicData = []
            }
        )
    }


    //商品详情(参数包)
    $scope.detailParme = [];
    function getParame (Id) {
        HttpFact.get(domain + "/api/Product/getProductParame", {Id: Id}).then(
            function (data) {
                $scope.detailParme = JSON.parse(data)
                console.log($scope.detailParme)
            },
            function (data) {
                $scope.detailParme = [];
            }
        )
    }


    $scope.SetCheck = function (v1, v2) {

        for (var i = 0; i < v2.length; i++) {
            v2[i].Check = false;
        }

        v1.Check = !v1.Check;
    };

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

    $scope.varlist = {
        itemNum: 1,
        total: 1,
    }

    // 减
    $scope.minus = function () {
        if ($scope.varlist.itemNum == 1) {
            return;
        } else {
            $scope.varlist.itemNum--;
        }
    }
    // 加
    $scope.add = function () {
        $scope.varlist.itemNum++;
    }

    $scope.isActive = false;
    $scope.ChangeIsActive = function () {
        $scope.isActive = !$scope.isActive;
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
                    //{
                    //    Img: "",
                    //    userName: "古道边",
                    //    EvaTime: "2016-12-22",
                    //    Review: "音质不错",
                    //    Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    //},
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
    });

    //加载数据事件
    // $scope.loadMore = function () {
    //     page++;
    //     getDetailData($stateParams.Id)
    // }

})

//分类
.controller('categoryController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact) {
    //获取数据
    $scope.proList = [];

    function getCategory() {
        HttpFact.get(domain + "/api/Product/getTypeList").then(
            function (data) {
                $scope.proList = JSON.parse(data);
            },

            function (data) {
                $scope.proList = [];
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
.controller('categoryListController',function($scope, $filter, $stateParams, HttpFact){
    var brandData; //接收返回data数据 
    var pageCount; //总页数
    var pageNow; //當前頁
    $scope.noData = true;
    $scope.brandCollect = {
        array_1: []
    }
    function getData (current, count, provId, strW){
        var submit = {
            current: current, //當前頁
            count: count, // 單頁條數
            provId: provId,
            strW: strW
        }
        console.log(submit)
        HttpFact.post(domain + "/api/Product/getProductList",submit).then(
            function (data){
                brandData = JSON.parse(data)
                console.log(brandData)
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

//咨讯
.controller('informationController', function ($scope, $filter, $stateParams, HttpFact) {

    var pageNow = 1; //当前页数
    var _size = 7;  //控制单页显示条数
    var jsonData; //接收返回data数据 
    var pageCount; //总页数
    $scope.noData = true;
    $scope.information = {
        array_1: [], //设置为空
    };

    function getInformation(type, current, count, strW, provId) {
        //获取数据所需参数
        var submitData = {
            type: type,
            current: current, //当前页数
            count: count, //单页条数
            strW: strW,
            provId: provId
        }

        HttpFact.post(domain + "/api/Art/getList", submitData).then(
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
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getInformation(1, pageNow, _size, "and 1 = 1", 1);
    });

    //加载数据事件
    $scope.loadMore = function () {
        pageNow++;
        getInformation(1, pageNow, _size, "and 1 = 1", 1);
    }
})

//咨讯详情

.controller('informationDetailController', function ($scope, $filter, $stateParams, HttpFact) {
    function getInformationDetail(Id) {
        return HttpFact.get(domain + "/api/Art/getDetail?id=" + Id).then(
            function (data) {
                $scope.informationDetail = JSON.parse(data);
            },
            function (data) {
                $scope.informationDetail = [];
            });
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getInformationDetail($stateParams.Id);
    });

})
//我的进货单
.controller('ordersHomeController', function ($scope, $ionicPopup) {
    $scope.input = {}
    $scope.cartData =
		[
            {
                name: "品牌商：深圳罗技电子科技有限公司1",
                goods: [{
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机11",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 2,
                    tradeName: "Beats Solo8 无线头戴式耳机22",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }]

            }, {
                name: "品牌商：深圳罗技电子科技有限公司2",
                goods: [{
                    id: 3,
                    tradeName: "Beats Solo1 无线头戴式耳机33",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 4,
                    tradeName: "Beats Solo8 无线头戴式耳机44",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
                ]
            }
		]


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
})


//订单详情
.controller('ordersDetailController', function ($scope, $state, $ionicPopover) {


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
.controller('returnsDetailController', function ($scope) {
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
.controller('invoiceController', function ($scope) {
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
.controller('pickupController', function ($scope) {
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

})


//评价详情

.controller('commentDetailController', function ($scope) {
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


//会员中心--我的进货单

.controller('myOrdersController', function ($scope) {
    $scope.input = {}
    $scope.proData = [
            {
                name: "品牌商：深圳罗技电子科技有限公司1",
                goods: [{
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机11",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 2,
                    tradeName: "Beats Solo8 无线头戴式耳机22",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
                ]
            }, {
                name: "品牌商：深圳罗技电子科技有限公司2",
                goods: [{
                    id: 3,
                    tradeName: "Beats Solo1 无线头戴式耳机33",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 4,
                    tradeName: "Beats Solo8 无线头戴式耳机44",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
                ]
            }
    ]


    $scope.flag = { showDelete: false };



    $scope.delete = function (index1, index2) {
        if ($scope.proData[index1].goods.length <= 1) {
            $scope.proData.splice(index1, 1);
        }
        else {
            $scope.proData[index1].goods.splice(index2, 1);
        };
    };
})


//会员中心--账户设置

.controller('basicDataController', function ($scope) {
    $scope.input = {}


    $scope.input = { gender: "先生" };
    $scope.single_check = function (name, value) {

        $scope.input[name] = value;
    }

    var vm = $scope.vm = {};
    vm.cb = function () {
        console.log(vm.CityPickData1.areaData)
        console.log(vm.CityPickData2.areaData)
        console.log(vm.CityPickData3.areaData)
        console.log(vm.CityPickData4.areaData)
    }
    vm.CityPickData2 = {
        areaData: ['请选择城市'],
        title: '没有初始城市',
        hardwareBackButtonClose: false
    }
})

//设置头像
.controller('avatarSettingsController', function ($scope) {
    $scope.input = {}
})

.controller('uploadAvatarController', function ($scope) {

})

//账户设置-收货地址管理
.controller('addressManageController', function ($scope) {
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
})


//立即评价

.controller('reviewsController', function ($scope) {
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

//账户设置-地址管理 -- 添加新地址
.controller('newAddressController', function ($scope) {
    $scope.input = {}


    $scope.agree = true;
    $scope.is_agree = function () {
        $scope.agree = !$scope.agree;
    };
})

//退货操作
.controller('backGoodsController', function ($scope) {
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
.controller('favoriteController', function ($scope, $state, $ionicPopover) {
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
.controller('loginController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact, privilegeFact) {

    //数据获取
    $scope.data = {
        U_Name: "",
        U_Password: "",
        fingerprint: new Fingerprint().get() //获取游览器指纹
    }

    $scope.submit = function () {
        // if (judgeFact.mob($scope.input.userName) == false) {
        //   return false;
        // }

        console.log($scope.data)
        // if (judgeFact.email($scope.input.userName) == false) {
        //   return false;
        // }


        if ($scope.data.U_Password == "" || $scope.data.U_Password == null) {
            PopupFact.alert("提示", "密码不能为空");
            return false;
        };

        // if ($scope.data.userPass2 == "" || $scope.data.userPass2 == null) {
        //   PopupFact.alert("prompt", "Comfirmed password can not be empty!");
        //   return false;
        // };

        // if ($scope.data.userPass != $scope.data.userPass2) {
        //   PopupFact.alert("prompt", "Passwords should be the same!");
        //   return false;
        // };

        HttpFact.post(domain + "/api/User/getLogin", $scope.data).then(
        function (data) {
            switch (data.res_Code) {
                case -1:
                    PopupFact.alert("提示", "用户名不存在");
                    break;

                case 0:
                    PopupFact.alert("提示", "用户名或密码输入有误");
                    break;

                case 1:
                    localStorage.setItem("User-Token", data.res_Token);
                    // localStorage.setItem('ZMS_userName', data.res_UserInfo.NickName);
                    // if (data.res_UserInfo.Pic == "" || data.res_UserInfo.Pic == null) {
                    //   localStorage.setItem('ZMS_userPic', "/images/headImg.jpg");
                    // }
                    // else {
                    //   localStorage.setItem('ZMS_userPic', data.res_UserInfo.Pic);
                    // }

                    // localStorage.setItem('ZMS_userType', data.res_UserInfo.Type);
                    PopupFact.alert("提示", "登录成功", '$state.go("tabs.home")');
                    break;
            };
        },
        function (data) {
            PopupFact.alert("提示", "登录失败");
        });

    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        if (localStorage.getItem("User-Token") != undefined) {
            $state.go("tabs.home");
        };
    });

})