angular.module('DS.controllers', [])

//首页
.controller('homeController', function ($scope, $filter, $rootScope, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout, $ionicPopover, $ionicModal, HttpFact, PopupFact, privilegeFact, ModalFact, loginJumpFact, LoadingFact) {
    loginJumpFact.tokenJudge(location.href);

    //每次进入视图都执行
    $scope.$on("$ionicView.beforeEnter", function () {
        $ionicHistory.clearHistory();
        $ionicScrollDelegate.$getByHandle('switchHandle').resize();
        //$ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    });

    $scope.input = {
        brandName: '',   ///品牌名
        typeName: '',    // 产品类型名
        p_minBuy_one: '',      //起批数量范围一
        p_minBuy_two: '',      //起批数量范围二
        p_priceOriginal_One: '',     ///价格区间范围一
        p_priceOriginal_two: '',    // 价格区间范围二
        search: ''
    };
    var pages = [{ page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }];
    var sizes = [{ size: 7 }, { size: 3 }, { size: 3 }, { size: 7 }];
    /////轮播
    //清除缓存，否则轮播报错
    $rootScope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.banners = [];  //banner
    var newProducts = [];  //新品上架
    $scope.newProducts = [];
    var hots = []  //热销
    $scope.hots = [];
    var searchs = [];   //搜索
    $scope.searchs = [];
    $scope.cache = [];  //搜索记录
    $scope.maxCount = {};  //判断显示搜索记录还是搜索结果
    var status;  //判断是否能搜索到结果
    var notes = [];  //记录搜索记录
    var key = 'order by price3 asc';
    var brands = [];  //获取品牌
    $scope.brands = [];
    var types = [];  //获取类型
    $scope.types = [];
    $scope.noData_0 = true;  //热销
    $scope.noData_1 = true;  //搜索
    $scope.noData_2 = true;  //品牌
    $scope.noData_3 = true;  //类型
    //获取banner数据
    function getBanner(size) {
        var submit = {
            count: size
        };
        HttpFact.user.POST(domain + "/api/Art/getBanner", submit).then(
            function (data) {
                $scope.banners = JSON.parse(data);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.banners = [];
                //$rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "用户状态失效，请重新登录！", "location.href = location.href")');

            }
        );
    }
    //热销
    function getData(page, size) {
        var hotData = {
            current: page, //当前页数
            count: size, //单页条数
            strW: "",
            orderby: "PD.p_saleNum DESC"
        };
        HttpFact.user.POST(domain + "/api/Product/getProductList", hotData).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.hots = hots;
                        $scope.noData_0 = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        var pass = JSON.parse(data.res_Msg);
                        hots = hots.concat(pass[0].list);
                        $scope.hots = hots;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope.noData_0 = false;
                            }
                            else {
                                $scope.noData_0 = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.hots = []
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        );
    }
    /////新品上架
    function getNew(page, _size) {
        var newData = {
            current: page, //当前页数
            count: _size, //单页条数
            strW: "",
            orderby: "PD.p_onSaleTime DESC"
        }
        HttpFact.user.POST(domain + "/api/Product/getProductList", newData).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.newProducts = newProducts;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        pass = JSON.parse(data.res_Msg);
                        newProducts = newProducts.concat(pass[0].list)
                        $scope.newProducts = newProducts;
                        //console.log($scope.newProducts)
                        $timeout(function () {
                            $ionicSlideBoxDelegate.update();
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                }

            },
            function (data) {
                $scope.newProducts = [];
                // $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
            }
        )
    }
    //获取默认搜索内容
    function getCache() {
        var cache = localStorage.getItem("searchInput");
        if (cache != "" && cache != null && cache != undefined) {
            $scope.cache = cache.split(",").reverse();
        }
    }
    //搜索请求
    function search(page, size, key) {
        var push = {
            current: page,
            count: size,
            content: $scope.input.search,
            orderby: key,
            brandName: $scope.input.brandName,   ///品牌名
            typeName: $scope.input.typeName,    // 产品类型名
            p_minBuy_one: $scope.input.p_minBuy_one,      //起批数量范围一
            p_minBuy_two: $scope.input.p_minBuy_two,      //起批数量范围二
            p_priceOriginal_One: $scope.input.p_priceOriginal_One,     ///价格区间范围一
            p_priceOriginal_two: $scope.input.p_priceOriginal_two,    // 价格区间范围二
        }
        if (push.content != "" && push.content != null && push.content != undefined) {
            var cache = localStorage.getItem("searchInput");
            if (cache != null && cache != "" && cache != undefined) {
                var cacheTS = cache.split(",");
                var cacheLen = 0;
                for (var i = 0; i < cacheTS.length; i++) {
                    if (push.content == cacheTS[i]) {
                        cacheLen++;
                    }
                };
                if (cacheLen <= 0) {
                    localStorage.setItem("searchInput", cache + "," + push.content);
                };
            }
            else {
                localStorage.setItem("searchInput", push.content);
            };
        }
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Product/get_Sotr_Products", push).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 0:
                        if (status == 1) {
                            $scope.searchs = searchs;
                            $scope.noData_1 = false;
                            PopupFact.alert("提示", "未能搜索到商品")
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            break;
                        }
                        else {
                            $scope.searchs = searchs;
                            $scope.noData_1 = false;
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            break;
                        }
                    case 1:
                        status = 0;
                        pass = JSON.parse(data.res_Msg);
                        $scope.maxCount = pass[0];
                        searchs = searchs.concat(pass[0].list);
                        $scope.searchs = searchs;
                        //console.log($scope.searchs)
                        $timeout(function () {
                            $ionicHistory.clearHistory();
                            $ionicScrollDelegate.$getByHandle('switchHandle').resize();
                            $ionicSlideBoxDelegate.enableSlide(false);
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < sizes) {
                                $scope.noData_1 = false;
                            }
                            else {
                                $scope.noData_1 = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
                $scope.searchs = [];
            }
        )
    }
    //获取品牌数据
    function getBrand(page, size) {
        var submit = {
            current: page,
            count: size
        }
        HttpFact.user.POST(domain + "/api/Product/get_BrandList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.brands = brands;
                        $scope.noData_2 = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        brands = brands.concat(data.res_Msg);
                        $scope.brands = brands;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (data.res_Msg.length < size) {
                                $scope.noData_2 = false;
                            } else {
                                $scope.noData_2 = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.brands = [];
            }
        )
    }
    //获取类型数据
    function getType(page, size) {
        var submit = {
            current: page,
            count: size
        }
        HttpFact.user.POST(domain + "/api/Product/get_ProductTypeList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.types = types;
                        $scope.noData_3 = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        pass = data.res_Msg;
                        types = types.concat(pass);
                        $scope.types = types;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass.length < size) {
                                $scope.noData_3 = false;
                            } else {
                                $scope.noData_3 = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.types = [];
            }
        )
    }

    //点击搜索输入框
    $scope.is_input = function (obj) {
        pages[1].page = 1;
        searchs = [];
        $scope.searchs = [];
        obj.strnMax = 0;
        $scope.input.search = '';
        getCache();
    }

    //搜索按钮点击
    $scope.search_action = function () {
        status = 1;
        $ionicScrollDelegate.$getByHandle('small').scrollTop(500);
        pages[1].page = 1;
        searchs = [];
        $scope.searchs = [];
        $scope.noData_1 = false;
        search(pages[1].page, sizes[0].size, key);  //搜索
    }

    //搜索记录列表点击事件
    $scope.search_active = function (value) {
        status = 1;
        $ionicScrollDelegate.$getByHandle('small').scrollTop(500);
        pages[1].page = 1;
        searchs = [];
        $scope.searchs = [];
        $scope.input.search = value;
        $scope.noData_1 = true;
        search(pages[1].page, sizes[0].size, key);  //搜索
    }

    //清除搜索记录
    $scope.onDelete = function () {
        $scope.cache = [];
        localStorage.removeItem("searchInput");
    }

    //打开搜索框
    $scope.openSearch = function () {
        getCache();
        ModalFact.show($scope, "/templates/model/Search.html");
    }

    //关闭搜索框
    $scope.closeSearch = function (obj) {
        ModalFact.hide();
        searchs = [];
        $scope.searchs = [];
        obj.strnMax = 0;
        $scope.input.search = '';
        $scope.cache = []
    }
    //商品排序切换
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index, item) {
            $ionicScrollDelegate.$getByHandle('small').scrollTop(500);
            pages[1].page = 1;
            searchs = [];
            $scope.searchs = [];
            $scope.noData_1 = true;
            $scope.De_Switch.proIndex = index;
            if (index == 0) {
                if ($scope.De_Switch.item == 0 || $scope.De_Switch.item == '') {
                    $scope.De_Switch.item = 1;
                    key = 'order by price3 asc'; //表示价格从低到高
                    search(pages[1].page, sizes[0].size, key);
                }
                else {
                    $scope.De_Switch.item = 0;
                    key = 'order by price3 desc';  //表示价格从高到低
                    search(pages[1].page, sizes[0].size, key);
                }
            };
            if (index == 1) {
                if ($scope.De_Switch.item == 2 || $scope.De_Switch.item == '') {
                    $scope.De_Switch.item = 3;
                    key = 'order by p_saleNum asc';  //表示销量从高到低
                    search(pages[1].page, sizes[0].size, key);
                }
                else {
                    $scope.De_Switch.item = 2;
                    key = 'order by p_saleNum desc';  //表示销量从高到低
                    search(pages[1].page, sizes[0].size, key);
                }
            };
            if (index == 2) {
                if ($scope.De_Switch.item == 4 || $scope.De_Switch.item == '') {
                    $scope.De_Switch.item = 5;
                    key = 'order by P_turnover asc';  //表示成交额从高到低
                    search(pages[1].page, sizes[0].size, key);
                }
                else {
                    $scope.De_Switch.item = 4;
                    key = 'order by P_turnover desc';  //表示成交额从高到低
                    search(pages[1].page, sizes[0].size, key);
                }
            };
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }
    //箭头转换
    $("body").on("click", "a.Flip", function () {
        var thsb = $(this).siblings("a.Flip");
        if ($(this).hasClass("active1") == false) {
            $(this).addClass("active1").removeClass("active");
            thsb.removeClass("active").removeClass("active1");
        } else {
            $(this).removeClass("active1").addClass("active");
        }
    });
    //打开筛选弹框
    $ionicModal.fromTemplateUrl("/templates/model/screen.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.screenClick = function () {
        getCache();
        $scope.modal.show();
    };

    //关闭筛选弹框
    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.input = {
            brandName: '',   ///品牌名
            typeName: '',    // 产品类型名
            p_minBuy_one: '',      //起批数量范围一
            p_minBuy_two: '',      //起批数量范围二
            p_priceOriginal_One: '',     ///价格区间范围一
            p_priceOriginal_two: '',    // 价格区间范围二
        }
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
    };

    //清空筛选的条件
    $scope.clear_action = function (brands, types) {
        $scope.input = {
            current: 1,  //当前页
            count: 7,    //页面的条数
            brandName: '',   ///品牌名
            typeName: '',    // 产品类型名
            p_minBuy_one: '',      //起批数量范围一
            p_minBuy_two: '',      //起批数量范围二
            p_priceOriginal_One: '',     ///价格区间范围一
            p_priceOriginal_two: '',    // 价格区间范围二
            search: ''
        }
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
    }


    //选择品牌
    $scope.SetCheck = function (brand, brands) {
        $scope.input.brandName = brand.name;
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        brand.check = !brand.check;
    };
    //选择类型
    $scope.check_type = function (type, types) {
        $scope.input.typeName = type._name;
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
        type.check = !type.check;
    };

    //筛选商品数据请求
    $scope.filter_action = function () {
        if ($scope.input.p_minBuy_one != '' && $scope.input.p_minBuy_two == '') {
            PopupFact.alert("提示", "请输入起批数量")
            return;
        }
        if ($scope.input.p_minBuy_one == '' && $scope.input.p_minBuy_two != '') {
            PopupFact.alert("提示", "请输入起批数量")
            return;
        }
        if ($scope.input.p_priceOriginal_One != '' && $scope.input.p_priceOriginal_two == '') {
            PopupFact.alert("提示", "请输入价格区间")
            return;
        }
        if ($scope.input.p_priceOriginal_One == '' && $scope.input.p_priceOriginal_two != '') {
            PopupFact.alert("提示", "请输入价格区间")
            return;
        }
        searchs = [];
        $scope.searchs = [];
        $scope.input.search = '';
        pages[1].page = 1;
        $scope.noData = false;
        search(pages[1].page, sizes[0].size, key);  //搜索
        $scope.modal.hide();
    };

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(pages[0].page, sizes[0].size);  //热销
        getBanner(sizes[2].size);  //banner 
        getNew(pages[4].page, sizes[2].size);  //新品
        getCache();  //搜索记录
        getBrand(pages[2].page, sizes[3].size); //品牌
        getType(pages[3].page, sizes[3].size); //类型
    });

    //加载数据事件
    $scope.loadMore = function (index) {
        switch (index) {
            case 0:
                pages[0].page++;
                getData(pages[0].page, sizes[0].size);   //热销
                break;
            case 1:
                pages[1].page++;
                search(pages[1].page, sizes[0].size, key);  //搜索
                break;
            case 2:
                pages[2].page++;
                getBrand(pages[2].page, sizes[3].size);  //品牌
                break;
            case 3:
                pages[3].page++;
                getType(pages[3].page, sizes[3].size)  //类型
                break;
        }
    }
})

//产品列表
.controller('productListController', function ($scope, $rootScope, $timeout, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, ModalFact, HttpFact, PopupFact, loginJumpFact, LoadingFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {
        brandName: '',   ///品牌名
        typeName: '',    // 产品类型名
        p_minBuy_one: '',      //起批数量范围一
        p_minBuy_two: '',      //起批数量范围二
        p_priceOriginal_One: '',     ///价格区间范围一
        p_priceOriginal_two: '',    // 价格区间范围二
    };
    //每次进入视图都执行
    $scope.$on("$ionicView.beforeEnter", function () {
        $ionicHistory.clearHistory();
        $ionicScrollDelegate.$getByHandle('switchHandle').resize();
        $ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    });

    //筛选弹框
    $scope.screenClick = function () {
        ModalFact.show($scope, "/templates/model/pd-Screening.html");
    };

    //关闭筛选弹框
    $scope.closeModal = function () {
        ModalFact.hide();
        $scope.input = {
            brandName: '',   ///品牌名
            typeName: '',    // 产品类型名
            p_minBuy_one: '',      //起批数量范围一
            p_minBuy_two: '',      //起批数量范围二
            p_priceOriginal_One: '',     ///价格区间范围一
            p_priceOriginal_two: '',    // 价格区间范围二
        }
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
    };

    //商品列表排序数据获取
    var pages = [{ page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }];
    var size = 7;
    $scope.noData = true;
    var listProduct = [];  //商品列表排序数据
    $scope.listProduct = [];
    var orderby = 'order by price3 asc';
    function getData(page, size, orderby) {
        var submitData = {
            current: page, //当前页数
            count: size, //单页条数
            orderby: orderby,
            brandName: $scope.input.brandName,   ///品牌名
            productTypeName: $scope.input.typeName,    // 产品类型名
            p_minBuy_one: $scope.input.p_minBuy_one,      //起批数量范围一
            p_minBuy_two: $scope.input.p_minBuy_two,      //起批数量范围二
            p_priceOriginal_One: $scope.input.p_priceOriginal_One,     ///价格区间范围一
            p_priceOriginal_two: $scope.input.p_priceOriginal_two,    // 价格区间范围二
        }
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Product/get_Sotr_Products", submitData).then(
            function (data) {
                LoadingFact.hide();
                ModalFact.hide();
                switch (data.res_Code) {
                    case 0:
                        $scope.noData = false;
                        $scope.listProduct = listProduct;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        var pass;
                        pass = JSON.parse(data.res_Msg);
                        listProduct = listProduct.concat(pass[0].list);
                        $scope.listProduct = listProduct;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope.noData = false;
                            }
                            else {
                                $scope.noData = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
                $scope.listProduct = []
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
    //离开视图时执行事件
    $scope.$on("$ionicView.beforeLeave", function () {
        ModalFact.hide();
        $scope.input = {
            brandName: '',   ///品牌名
            productTypeName: '',    // 产品类型名
            p_minBuy_one: '',      //起批数量范围一
            p_minBuy_two: '',      //起批数量范围二
            p_priceOriginal_One: '',     ///价格区间范围一
            p_priceOriginal_two: '',    // 价格区间范围二
        }
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
    });

    //筛选商品数据请求
    $scope.filter_action = function () {
        if ($scope.input.p_minBuy_one != '' && $scope.input.p_minBuy_two == '') {
            PopupFact.alert("提示", "请输入起批数量")
            return;
        }
        if ($scope.input.p_minBuy_one == '' && $scope.input.p_minBuy_two != '') {
            PopupFact.alert("提示", "请输入起批数量")
            return;
        }
        if ($scope.input.p_priceOriginal_One != '' && $scope.input.p_priceOriginal_two == '') {
            PopupFact.alert("提示", "请输入价格区间")
            return;
        }
        if ($scope.input.p_priceOriginal_One == '' && $scope.input.p_priceOriginal_two != '') {
            PopupFact.alert("提示", "请输入价格区间")
            return;
        }
        listProduct = [];
        $scope.listProduct = [];
        pages[0].page = 1;
        $scope.noData = false;
        getData(pages[0].page, size, orderby);
    };


    //清空筛选的条件
    $scope.clear_action = function (brands, types) {
        $scope.input = {
            current: 1,  //当前页
            count: 7,    //页面的条数
            brandName: '',   ///品牌名
            productTypeName: '',    // 产品类型名
            p_minBuy_one: '',      //起批数量范围一
            p_minBuy_two: '',      //起批数量范围二
            p_priceOriginal_One: '',     ///价格区间范围一
            p_priceOriginal_two: '',    // 价格区间范围二
        }
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
    }

    //选择品牌和类型
    $scope.SetCheck = function (brand, brands) {
        $scope.input.brandName = brand.name;
        for (var i = 0; i < brands.length; i++) {
            brands[i].check = false;
        }
        brand.check = !brand.check;
    };
    $scope.check_type = function (type, types) {
        $scope.input.typeName = type._name;
        for (var i = 0; i < types.length; i++) {
            types[i].check = false;
        }
        type.check = !type.check;
    };
    $scope.De_Switch = {
        item: []
    }
    //商品排序切换
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index, item) {
            $ionicScrollDelegate.$getByHandle('small').scrollTop(500);
            listProduct = [];
            $scope.listProduct = [];
            pages[0].page = 1;
            $scope.noData = true;
            $scope.De_Switch.proIndex = index;
            if (index == 0) {
                if ($scope.De_Switch.item == 0 || $scope.De_Switch.item == '') {
                    $scope.De_Switch.item = 1;
                    orderby = 'order by price3 asc'; //表示价格从低到高
                    getData(pages[0].page, size, orderby);
                }
                else {
                    $scope.De_Switch.item = 0;
                    orderby = 'order by price3 desc';  //表示价格从高到低
                    getData(pages[0].page, size, orderby);
                }
            };
            if (index == 1) {
                if ($scope.De_Switch.item == 2 || $scope.De_Switch.item == '') {
                    $scope.De_Switch.item = 3;
                    orderby = 'order by p_saleNum asc';  //表示销量从高到低
                    getData(pages[0].page, size, orderby);
                }
                else {
                    $scope.De_Switch.item = 2;
                    orderby = 'order by p_saleNum desc';  //表示销量从高到低
                    getData(pages[0].page, size, orderby);
                }
            };
            if (index == 2) {
                if ($scope.De_Switch.item == 4 || $scope.De_Switch.item == '') {
                    $scope.De_Switch.item = 5;
                    orderby = 'order by P_turnover asc';  //表示成交额从高到低
                    getData(pages[0].page, size, orderby);
                }
                else {
                    $scope.De_Switch.item = 4;
                    orderby = 'order by P_turnover desc';  //表示成交额从高到低
                    getData(pages[0].page, size, orderby);
                }
            };
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }


    //是否选择运费和退换
    $scope.is_checked = function () {
        $scope.input.p_freeFreight = !$scope.input.p_freeFreight;
        if ($scope.input.p_freeFreight == false) {
            $scope.input.p_freeFreight = '';
        } else {
            $scope.input.p_freeFreight = 1;
            console.log($scope.input.p_freeFreigh)
        }

    }
    //箭头转换
    $(".filter").on("click", "a.Flip", function () {
        var thsb = $(this).siblings("a.Flip");
        if ($(this).hasClass("active1") == false) {
            $(this).addClass("active1").removeClass("active");
            thsb.removeClass("active").removeClass("active1");
        } else {
            $(this).removeClass("active1").addClass("active");
        }
    });

    //筛选弹框
    var brands = [];
    $scope.brands = [];
    $scope.notData = true;
    //获取品牌数据
    function getBrand(page, size) {
        var submit = {
            current: page,
            count: size
        }
        HttpFact.user.POST(domain + "/api/Product/get_BrandList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.brands = brands;
                        $scope.notData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        brands = brands.concat(data.res_Msg);
                        $scope.brands = brands;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (data.res_Msg.length < size) {
                                $scope.notData = false;
                            } else {
                                $scope.notData = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.brands = [];
            }
        )
    }
    var types = [];
    $scope.types = [];
    $scope._notData = true;
    //获取类型数据
    function getType(page, size) {
        var submit = {
            current: page,
            count: size
        }
        HttpFact.user.POST(domain + "/api/Product/get_ProductTypeList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.types = types;
                        $scope._notData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        pass = data.res_Msg;
                        types = types.concat(pass);
                        $scope.types = types;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass.length < size) {
                                $scope._notData = false;
                            } else {
                                $scope._notData = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.types = [];
            }
        )
    }

    $scope.$on("$ionicView.afterEnter", function () {
        getBrand(pages[1].page, size);
        getType(pages[2].page, size);
    });

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(pages[0].page, size, orderby);
    });
    //加载数据事件
    $scope.loadMore = function (index) {
        switch (index) {
            case 0:
                pages[0].page++;
                getData(pages[0].page, size, orderby);
                break;
            case 1:
                pages[1].page++;
                getBrand(pages[1].page, size);
                break;
            case 2:
                pages[2].page++;
                getType(pages[2].page, size);
                break;
            case 3:
                $scope.input.current++;
                $scope.filter_action($scope.input.current, size)
                break;
        }
    };
})

//产品详情
.controller('productDetailsController', function ($scope, $ionicPopover, filterFilter, $timeout, $ionicScrollDelegate, $stateParams, $state, $rootScope, HttpFact, judgeFact, PopupFact, $ionicSlideBoxDelegate, loginJumpFact, LoadingFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {
        version: "",
        color: ""
    }
    $scope.pro = {}
    var page = 1;
    var size = 7;
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
    var details = []
    $scope.details = []
    var miniNum = {}
    function getDetailData(Id) {
        var detail = {
            id: Id
        }
        HttpFact.user.GET(domain + "/api/Product/getProductDetail?id=" + Id).then(
            function (data) {
                details = JSON.parse(data);
                $scope.details = details[0];
                //console.log($scope.details)
                $scope.pro.brandId = Number($scope.details.p_provAgentId);
                $scope.basicImg = $scope.details.p_Pic.split(',');
                miniNum = Number($scope.details.p_minBuy);   //最低购买数量
                $scope.varlist.itemNum = miniNum; //最低购买数量赋值
                $scope.lowNumber.low1 = Number($scope.details.p_priceScopeTitle1);
                $scope.lowNumber.low2 = Number($scope.details.p_priceScopeTitle2);
                $scope.lowNumber.low3 = Number($scope.details.p_priceScopeTitle3);
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
    $scope.default_storage = {} //默认库存
    var default_stock;
    function getParame(Id) {
        HttpFact.user.GET(domain + "/api/Product/getProductParame?id=" + Id).then(
            function (data) {
                $scope.detailParme = JSON.parse(data);
                //console.log($scope.detailParme)
                $scope.paramId = $scope.detailParme[0].paramId;
                //console.log($scope.paramId)
                // 初始化颜色和版本
                $scope.input.color = $scope.detailParme.p_param1;
                $scope.parmeImg = $scope.detailParme[0].p_pic.split(',');
                //选择版本
                var obj = filterFilter($scope.detailParme, { p_param1: $scope.input.color }, true);
                $scope.TypeModelList = []; //版本
                var type = []
                for (var i = 0; i < obj.length; i++) {
                    type.push(obj[i].p_param2);
                }
                $scope.TypeModelList = unique(type)
                // $scope.input.version = $scope.TypeModelList[0]    //默认选中版本
                //选择颜色
                var temp = [] //定义变量存储push的数据
                $scope.temps = []; //定义处理后的数据

                for (var i = 0; i < $scope.detailParme.length; i++) {
                    temp.push($scope.detailParme[i].p_param1);
                }

                $scope.temps = unique(temp)
                // $scope.input.color = $scope.temps[0]  //默认选中颜色
                //折扣
                $scope.initial1 = $scope.detailParme[0].p_priceScope1;
                $scope.initial2 = $scope.detailParme[0].p_priceScope2;
                $scope.initial3 = $scope.detailParme[0].p_priceScope3;
                //筛选
                var arr = filterFilter($scope.detailParme, { p_param2: $scope.input.version, p_param1: $scope.input.color }, true)
                for (var i = 0; i < arr.length; i++) {
                    $scope.default_storage = Number(arr[i].p_storage); //默认库存
                    console.log($scope.default_storage)
                }
                $scope.default_storage = Number($scope.default_storage);   //默认库存

                default_stock = Number($scope.default_storage);
            },
            function (data) {
                $scope.detailParme = [];
                // $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
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
    $scope.storage = ''; //库存
    function match() {
        if (value == '' || key == '') {
            return;
        } else {
            //筛选
            var arr = filterFilter($scope.detailParme, { p_param2: key, p_param1: value }, true)
            for (var i = 0; i < arr.length; i++) {
                $scope.prices.price1 = arr[i].p_priceScope1;
                $scope.prices.price2 = arr[i].p_priceScope2;
                $scope.prices.price3 = arr[i].p_priceScope3;
                $scope.productId = arr[i].p_proId; //产品id
                $scope.paramId = arr[i].paramId; //参数包id
                $scope.inStock = Number(arr[i].p_storage); //库存
                //console.log($scope.inStock)
            }
        }
        //console.log(arr);
    }

    //选择版本
    $scope.select_version = function (version) {
        $scope.input.version = version;
        key = version;
        match();
    };
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
        //$scope.Numblur();
    };
    //商品信息购买界面
    $scope.popoverPro;
    $ionicPopover.fromTemplateUrl("/templates/model/ez-popover.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popoverPro = popover;
    });
    //打开商品信息购买界面
    $scope.payProClick = function ($event) {
        $scope.popoverPro.show($event);
    };
    //关闭商品信息购买界面
    $scope.closePopover = function () {
        $scope.popoverPro.hide();
        $scope.input = {
            version: "",
            color: ""
        }
    };
    //销毁事件回调处理：清理popover对象
    $scope.$on("$destroy", function () {
        $scope.popoverPro.remove();
    });
    var arr = [];
    // $scope.inStock = '';
    var miniNum = '';
    $scope.varlist = {
        itemNum: '',
    }
    $scope.number_change = function () {
        if ($scope.varlist.itemNum > $scope.default_storage) {
            $scope.Numblur();
            $scope.varlist.itemNum = $scope.inStock;
        };
    }
    //监听输入框数字变化
    //$scope.$watch($scope.number_change);
    //$scope.$watch('varlist.itemNum', function (newValue, oldValue, scope) {
    //    if (Number(newValue) > $scope.default_storage) {
    //        $scope.varlist.itemNum = $scope.inStock;
    //    };
    //    console.log($scope.default_storage);
    //    console.log(newValue);
    //    console.log(oldValue);
    //});
    // 减
    $scope.minus = function () {
        if ($scope.input.color == undefined || $scope.input.version == 0) {
            PopupFact.alert('提示', '请选择颜色和版本')
            return;
        }
        if ($scope.varlist.itemNum <= miniNum) {
            $scope.varlist.itemNum = miniNum
        } else {
            $scope.varlist.itemNum--;
        }
    }
    // 加
    $scope.add = function () {
        if ($scope.input.color == undefined || $scope.input.version == 0) {
            PopupFact.alert('提示', '请选择颜色和版本')
            return;
        }
        if ($scope.varlist.itemNum >= $scope.inStock) {
            PopupFact.alert("提示", "已达到最大库存数量");
            $scope.Numblur()
        } else {
            $scope.varlist.itemNum++;
        }
    }

    //判断库存量，如果大于库存量，最大数重置为最大库存量
    $scope.Numblur = function () {
        if ($scope.input.color == undefined || $scope.input.version == 0) {
            PopupFact.alert('提示', '请选择颜色和版本')
            return;
        }
        if ($scope.varlist.itemNum > $scope.inStock) {
            $scope.varlist.itemNum = $scope.inStock;
        }
        if ($scope.varlist.itemNum > $scope.default_storage) {
            $scope.varlist.itemNum = $scope.default_storage;
        };
        $scope.$watch('varlist.itemNum', function (newValue, oldValue, scope) {
            if (Number(newValue) > $scope.inStock) {
                PopupFact.alert("提示", "已达到最大库存数量,请重新输入进货数量");
                $scope.varlist.itemNum = $scope.inStock;
                $scope.Numblur();
            };
        });
    }
    //, paramId: Number($scope.paramId) 
    // 加入收藏
    $scope.is_like = function () {
        LoadingFact.show
        HttpFact.user.POST(domain + "/api/User/Add_Collect_Product", { productId: Number($stateParams.Id)}).then(
                function (data) {
                    LoadingFact.hide();
                    switch (data.res_Code) {
                        case 0:
                            PopupFact.alert("提示", "收藏失败");
                            location.href = location.href;
                            break;
                        case 1:
                            location.href = location.href;
                            break;
                        case 2:
                            location.href = location.href;
                            break;
                    }
                }
            )
    };

    //添加到进货单
    $scope.add_action = function (productId, paramId, Num) {
        //console.log($scope.input.version)
        //console.log($scope.input.color)
        if ($scope.input.color == undefined || $scope.input.version == 0) {
            PopupFact.alert('提示', '请选择颜色和版本')
            return;
        }
        if ($scope.varlist.itemNum > $scope.inStock) {
            PopupFact.alert("提示", "已达到最大库存数量,请重新输入进货数量");
            $scope.Numblur();
            return;
        }

        HttpFact.user.POST(domain + "/api/Order/shoppingCartAdd", { productId: Number($scope.productId), paramId: Number($scope.paramId), provAgentId: $scope.pro.brandId, Num: $scope.varlist.itemNum }).then(
            function (data) {
                switch (data.res_Code) {
                    case 1:
                        PopupFact.alert("提示", "成功加入进货单");
                        break;
                    case -1:
                        PopupFact.alert("提示", "加入进货单失败");
                        break;
                }
                return;
            },
            function (data) {
                // $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )

    }

    //评论数据绑定
    function getEvaluation(page, size) {
        var detail = {
            current: page,
            count: size,
            productId: Number($stateParams.Id)
        }
        HttpFact.user.POST(domain + "/api/Product/get_Product_CommentList", detail).then(
            function (data) {
                $scope.posss = data.res_Msg;
            },
            function (data) {
                $scope.posss = [];
            }
        )
    }
    //切换
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;
            $ionicScrollDelegate.resize();//重置滚动条高度
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }



    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getEvaluation(page, size);   //评价列表
        getDetailData($stateParams.Id);
        getParame($stateParams.Id);
        $ionicSlideBoxDelegate.update();
        if ($scope.basicImg.length < 3) {
            $ionicSlideBoxDelegate.loop(false);
        } else {
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
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
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

//品牌列表
.controller('categoryListController', function ($scope, $rootScope, $filter, $timeout, $stateParams, $ionicScrollDelegate, HttpFact, loginJumpFact) {
    loginJumpFact.tokenJudge("categoryList");

    var page = 1; //页数
    var size = 6; //單頁條數
    $scope.noData = true;
    var brands = []; //接收返回data数据
    $scope.brands = []
    function getData(page, size) {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
            brandId: $stateParams.brandId, // 品牌id
            p_typeId: $stateParams.typeId,  //产品类型Id
            orderby: "PD.p_onSaleTime DESC"
        }
        HttpFact.user.POST(domain + "/api/Product/getProductList", JSON.stringify(submit)).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.brands = brands;
                        $scope.noData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        pass = JSON.parse(data.res_Msg);
                        brands = brands.concat(pass[0].list);
                        $scope.brands = brands;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope.noData = false;
                            }
                            else {
                                $scope.noData = true;
                            }
                        }, 500)
                        break;
                }
            },
            function (data) {
                $scope.brandCollect = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(page, size);
    });

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getData(page, size);
    }

})

//资讯
.controller('informationController', function ($scope, $rootScope, $filter, $stateParams, HttpFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    var page = 1; //当前页数
    var size = 7; //控制单页显示条数
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
                } else if (pageCount == pageNow) {
                    $scope.information.array_1 = $scope.information.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                } else {
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
        getInformation(1, page, size, "and 1 = 1");
    });

    //加载数据事件
    $scope.loadMore = function () {
        pageNow++;
        getInformation(1, page, size, "and 1 = 1");
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
.controller('ordersController', function ($scope, $rootScope, $ionicPopup, $ionicPopover, $ionicScrollDelegate, $timeout, filterFilter, LoadingFact, loginJumpFact, HttpFact, PopupFact, LoadingFact) {
    loginJumpFact.tokenJudge("orders");
    $scope.input = {
        number: ''
    }    //
    $scope.pro = {}   //购买数量弹框,商品信息对象全局变量
    var page = 1;
    var size = 2;
    var shoppings = [];
    $scope.shoppings = []
    $scope.noData = true;
    function getShopping() {
        var submit = {
            current: page,
            count: size
        }
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/get_My_shoppingCartTable", submit).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case -1:
                        $scope.shoppings = shoppings;
                        $scope.noData = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 0:
                        $scope.shoppings = shoppings;
                        $scope.noData = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        var Data;
                        Data = JSON.parse(data.res_Msg.m_StringValue);
                        shoppings = shoppings.concat(Data.MobList);
                        $scope.shoppings = shoppings;
                        //console.log(shoppings)
                        $scope.shoppings.count_total = compute($scope.shoppings);
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (Data.MobList.length < size) {
                                isPull = false;
                                $scope.noData = false;
                            }
                            else {
                                isPull = true;
                                $scope.noData = true;
                            }
                        }, 500);
                        break;

                }
            },
            function (data) {
                LoadingFact.hide();
                $scope.shoppings = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //计算订单价格
    function compute(obj) {
        var count_total = 0;
        for (var i = 0; i < obj.length; i++) {
            count_total = 0;
            for (var s = 0; s < obj[i].data.length; s++) {
                var shopData = obj[i].data[s];
                if (Number(shopData._num) >= Number(shopData.minBuy) && Number(shopData._num) < Number(shopData.priceScopeTitle1)) {
                    count_total += Number(shopData.priceOriginal) * Number(shopData._num);
                }
                else if (Number(shopData._num) >= Number(shopData.priceScopeTitle1) && Number(shopData._num) < Number(shopData.priceScopeTitle2)) {
                    count_total += Number(shopData.priceScope1) * Number(shopData._num);
                }
                else if (Number(shopData._num) >= Number(shopData.priceScopeTitle2) && Number(shopData._num) < Number(shopData.priceScopeTitle3)) {
                    count_total += Number(shopData.priceScope2) * Number(shopData._num);
                }
                else if (Number(shopData._num) >= Number(shopData.priceScopeTitle3)) {
                    count_total += Number(shopData.priceScope3) * Number(shopData._num);
                }
            };
            //obj[i].count_total = count_total;
            obj[i].count_total = count_total.toFixed(2);
        };
    }

    ////删除初始化
    $scope.flag = { showDelete: false };

    //删除商品操作
    $scope.delete = function (proId, paramId, total, brandId, _id, arr) {
        var submit = {
            productId: Number(proId),
            paramId: Number(paramId),
            Num: Number(total),
            provAgentId: Number(brandId)
        }
        HttpFact.user.POST(domain + "/api/Order/Delete_ShoppingCart", submit).then(
            function (data) {
                console.log(data)
                switch (data.res_Code) {
                    case 0:
                        PopupFact.alert("提示", "删除失败，请重新刷新", "location.href = location.href")
                        break;
                    case 1:
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i]._id == _id) {
                                arr.splice(i, 1)
                            }
                        }
                        break;
                }
            }
        )

    };
    //减
    $scope.minus = function (obj) {
        var count_number = Number(obj._num);   //购买数量
        var miniNum = Number(obj.minBuy);

        if (count_number <= miniNum) {
            obj._num = miniNum
        } else {
            obj._num--;
            var total = {
                productId: Number(obj.oductId),
                paramId: Number(obj.ramId),
                Num: Number(obj._num)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
        }
        $scope.input.number = obj._num;
        $scope.shoppings.count_total = compute($scope.shoppings)
    }
    // 加
    $scope.add = function (obj) {
        console.log(obj)
        var count_number = Number(obj._num);    //数量
        var maxStorage = Number(obj.storage);  //最大库存数量
        var miniNum = Number(obj.minBuy);      //最低购买数量
        var price = Number(obj.priceOriginal);  //原价
        var price_1 = Number(obj.priceScope1);  //价格
        var price_2 = Number(obj.priceScope2);
        var price_3 = Number(obj.priceScope3);
        var section_1 = Number(obj.priceScopeTitle1);  //数量区间
        var section_2 = Number(obj.priceScopeTitle2);
        var section_3 = Number(obj.priceScopeTitle3);
        if (count_number >= maxStorage) {
            PopupFact.alert("提示", "已达到最大库存数量");
            obj._num = maxStorage;
        } else {
            obj._num++;
            var total = {
                productId: Number(obj.oductId),
                paramId: Number(obj.ramId),
                Num: Number(obj._num)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
        }
        $scope.input.number = obj._num;
        $scope.shoppings.count_total = compute($scope.shoppings)
        //$scope.shoppings.count_total = $scope.shoppings.count_total.toFixed(3);
        //$scope.shoppings.count_total = $scope.shoppings.count_total.substring(0, s.indexOf(".") + 3);
    };

    //转换数字
    $scope.Number = Number;

    $ionicPopover.fromTemplateUrl("/templates/model/count.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    //定义全局变量 商品修改前数量
    var beforeNum = '';
    //打开购买数量弹框
    $scope.revise_action = function (obj) {
        $scope.popover.show();
        $scope.pro = obj;
        $scope.input.number = obj._num;
        beforeNum = obj._num;
    }
    //取消购买数量弹框
    $scope.closeConfirm = function (o) {
        console.log(o)
        o._num = beforeNum;
        var total = {
            productId: Number(o.oductId),
            paramId: Number(o.ramId),
            Num: Number(beforeNum)
        }
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
        function (data) {
            LoadingFact.hide();
            console.log(data)
        })
        $scope.popover.hide();

        //$scope.shoppings.count_total = compute($scope.shoppings)
    };
    //修改购买数量弹框
    $scope.revise_confirm = function (n, o) {
        $scope.popover.hide();
        console.log(n);
        console.log(o)
        if (n > Number(o.storage)) {
            PopupFact.alert("提示", "已达到最大库存数量,请重新修改数量");
            o._num = o.storage;
            var total = {
                productId: Number(o.oductId),
                paramId: Number(o.ramId),
                Num: Number(o.storage)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
            return;
        }
        if (n < Number(o.minBuy) || n == '' || n == null) {
            o._num = o.minBuy;
            var total = {
                productId: Number(o.oductId),
                paramId: Number(o.ramId),
                Num: Number(o.minBuy)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
        } else {
            o._num = n;
            var total = {
                productId: Number(o.oductId),
                paramId: Number(o.ramId),
                Num: Number(o._num)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
            })
        }
        $scope.shoppings.count_total = compute($scope.shoppings);
        //console.log(compute($scope.shoppings))
        //var money= $scope.shoppings.count_total.toFixed(2);
        //$scope.shoppings.count_total = money.substring(0, money.indexOf(".") + 3);
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.beforeEnter", function () {
        getShopping(page, size);
    });

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getShopping(page, size);
    }

})

//会员中心--我的进货单
.controller('orderController', function ($scope, $rootScope, $ionicPopup, $ionicPopover, $ionicScrollDelegate, $timeout, filterFilter, LoadingFact, loginJumpFact, HttpFact, PopupFact, LoadingFact, ModalFact) {
    loginJumpFact.tokenJudge("orders");
    $scope.input = {
        number: ''
    }    //
    $scope.pro = {}   //购买数量弹框,商品信息对象全局变量
    var page = 1;
    var size = 2;
    var shoppings = [];
    $scope.shoppings = []
    $scope.noData = true;
    function getShopping() {
        var submit = {
            current: page,
            count: size
        }
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/get_My_shoppingCartTable", submit).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case -1:
                        $scope.shoppings = shoppings;
                        $scope.noData = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 0:
                        $scope.shoppings = shoppings;
                        $scope.noData = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        var Data;
                        Data = JSON.parse(data.res_Msg.m_StringValue);
                        shoppings = shoppings.concat(Data.MobList);
                        $scope.shoppings = shoppings;
                        console.log(shoppings)
                        $scope.shoppings.count_total = compute($scope.shoppings);
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (Data.MobList.length < size) {
                                isPull = false;
                                $scope.noData = false;
                            }
                            else {
                                isPull = true;
                                $scope.noData = true;
                            }
                        }, 500);
                        break;

                }
            },
            function (data) {
                LoadingFact.hide();
                $scope.shoppings = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //计算订单价格
    function compute(obj) {
        var count_total = 0;
        for (var i = 0; i < obj.length; i++) {
            count_total = 0;
            for (var s = 0; s < obj[i].data.length; s++) {
                var shopData = obj[i].data[s];
                if (Number(shopData._num) >= Number(shopData.minBuy) && Number(shopData._num) < Number(shopData.priceScopeTitle1)) {
                    count_total += Number(shopData.priceOriginal) * Number(shopData._num);
                }
                else if (Number(shopData._num) >= Number(shopData.priceScopeTitle1) && Number(shopData._num) < Number(shopData.priceScopeTitle2)) {
                    count_total += Number(shopData.priceScope1) * Number(shopData._num);
                }
                else if (Number(shopData._num) >= Number(shopData.priceScopeTitle2) && Number(shopData._num) < Number(shopData.priceScopeTitle3)) {
                    count_total += Number(shopData.priceScope2) * Number(shopData._num);
                }
                else if (Number(shopData._num) >= Number(shopData.priceScopeTitle3)) {
                    count_total += Number(shopData.priceScope3) * Number(shopData._num);
                }
            };
            obj[i].count_total = count_total;
            //obj[i].count_total = count_total.toFixed(2);
        };
    }

    ////删除初始化
    $scope.flag = { showDelete: false };

    //删除商品操作
    $scope.delete = function (proId, paramId, total, brandId, _id, arr) {
        var submit = {
            productId: Number(proId),
            paramId: Number(paramId),
            Num: Number(total),
            provAgentId: Number(brandId)
        }
        HttpFact.user.POST(domain + "/api/Order/Delete_ShoppingCart", submit).then(
            function (data) {
                console.log(data)
                switch (data.res_Code) {
                    case 0:
                        PopupFact.alert("提示", "删除失败，请重新刷新", "location.href = location.href")
                        break;
                    case 1:
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i]._id == _id) {
                                arr.splice(i, 1)
                            }
                        }
                        break;
                }
            }
        )

    };
    //减
    $scope.minus = function (obj) {
        var count_number = Number(obj._num);   //购买数量
        var miniNum = Number(obj.minBuy);

        if (count_number <= miniNum) {
            obj._num = miniNum
        } else {
            obj._num--;
            var total = {
                productId: Number(obj.oductId),
                paramId: Number(obj.ramId),
                Num: Number(obj._num)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
        }
        $scope.input.number = obj._num;
        $scope.shoppings.count_total = compute($scope.shoppings)
    }
    // 加
    $scope.add = function (obj) {
        console.log(obj)
        var count_number = Number(obj._num);    //数量
        var maxStorage = Number(obj.storage);  //最大库存数量
        var miniNum = Number(obj.minBuy);      //最低购买数量
        var price = Number(obj.priceOriginal);  //原价
        var price_1 = Number(obj.priceScope1);  //价格
        var price_2 = Number(obj.priceScope2);
        var price_3 = Number(obj.priceScope3);
        var section_1 = Number(obj.priceScopeTitle1);  //数量区间
        var section_2 = Number(obj.priceScopeTitle2);
        var section_3 = Number(obj.priceScopeTitle3);
        if (count_number >= maxStorage) {
            PopupFact.alert("提示", "已达到最大库存数量");
            obj._num = maxStorage;
        } else {
            obj._num++;
            var total = {
                productId: Number(obj.oductId),
                paramId: Number(obj.ramId),
                Num: Number(obj._num)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
        }
        $scope.input.number = obj._num;
        $scope.shoppings.count_total = compute($scope.shoppings)
        //$scope.shoppings.count_total = $scope.shoppings.count_total.toFixed(3);
        //$scope.shoppings.count_total = $scope.shoppings.count_total.substring(0, s.indexOf(".") + 3);
    };

    //转换数字
    $scope.Number = Number;

    $ionicPopover.fromTemplateUrl("/templates/model/count.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    //定义全局变量 商品修改前数量
    var beforeNum = '';
    //打开购买数量弹框
    $scope.revise_action = function (obj) {
        $scope.popover.show();
        $scope.pro = obj;
        $scope.input.number = obj._num;
        beforeNum = obj._num;
    }
    //取消购买数量弹框
    $scope.closeConfirm = function (o) {
        console.log(o)
        o._num = beforeNum;
        var total = {
            productId: Number(o.oductId),
            paramId: Number(o.ramId),
            Num: Number(beforeNum)
        }
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
        function (data) {
            LoadingFact.hide();
            console.log(data)
        })
        $scope.popover.hide();

        //$scope.shoppings.count_total = compute($scope.shoppings)
    };
    //修改购买数量弹框
    $scope.revise_confirm = function (n, o) {
        $scope.popover.hide();
        console.log(n);
        console.log(o)
        if (n < Number(o.minBuy) || n == '' || n == null) {
            n = o.minBuy;
            var total = {
                productId: Number(o.oductId),
                paramId: Number(o.ramId),
                Num: Number(o.minBuy)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
            })
        } else {
            o._num = n;
            var total = {
                productId: Number(o.oductId),
                paramId: Number(o.ramId),
                Num: Number(o._num)
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Update_ShoppingCart_Product_Number", JSON.stringify(total)).then(
            function (data) {
                LoadingFact.hide();
            })
        }
        $scope.shoppings.count_total = compute($scope.shoppings);
        //console.log(compute($scope.shoppings))
        //var money= $scope.shoppings.count_total.toFixed(2);
        //$scope.shoppings.count_total = money.substring(0, money.indexOf(".") + 3);
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getShopping(page, size);
    });

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getShopping(page, size);
    }

})

//填写订单信息
.controller('ordersInfoController', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicPopover, $ionicScrollDelegate, loginJumpFact, HttpFact, LoadingFact, PopupFact, ModalFact) {
    loginJumpFact.tokenJudge(location.href);
    //转换数字
    $scope.Number = Number;
    $scope.input = {
        provAgentId: '',  //代理商Id
        o_totalPrice: '',  //订单总价格
        freight: '',  //运费
        o_freeFreight: '',//是否免运费
        o_recieverWay: 1,  //收货方式
        o_reciever: '',  //收货人
        o_prov: '',   //收货省份
        o_city: '',    //收货市
        o_dist: '',   //收货区
        o_detailAddr: '',   //收货详细地址
        o_phone: '',   //联系电话
        o_remark: '',  //备注
        o_invoice: '',   //发票
        Json_TotalPrice: ''    //包含商品Id,商品参数Id,购买数量，商品价格
    };

    $scope.check = {} //选择支付方式
    $scope.orderId;  //订单ID
    $scope.focus = {}
    var orders = [];  //进货单内容
    $scope.orders = [];
    var addrss = [];  //地址信息
    $scope.addrss = {};
    var defaultAddress = []; //默认地址信息
    $scope.defaultAddress = [];
    var invoice = [];  //发票
    $scope.invoice = [];
    var information = [];
    $scope.information = [];
    $scope.freight = [];   //运费
    $scope.agentId = [];   //代理商Id
    $scope.info = {
        id: ''
    }  //获取发票/备注ID
    var excess = [] //接收遍历对象赋值
    var total = 0; //金额
    //进货单内容数据
    function getData() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/get_My_ShoppingCarts", { provAgentId: Number($stateParams.id) }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 0:
                        $scope.orders = orders;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        orders = data.res_Msg;
                        $scope.orders = orders;
                        //console.log($scope.orders)
                        $scope.company = orders[0]._name;  ///公司名
                        $scope.input.freight = Number(orders[0]._Freight);  //运费
                        $scope.input.provAgentId = Number(orders[0]._ProvAgentId);  //获取地址信息ID
                        $scope.info.id = orders[0].ovA_Id;   //获取发票/备注信息ID
                        for (var i = 0; i < orders.length; i++) {
                            excess.push({
                                ProductId: orders[i]._proId,
                                ParamId: orders[i]._paraId,
                                sum: orders[i]._num,
                                Prices: orders[i]._Price
                            });
                            total += Number(orders[i]._Price) * Number(orders[i]._num);
                        }
                        var total_count = total.toFixed(2);
                        $scope.amount = total_count.substring(0, total_count.indexOf(".") + 3)  //页面显示总价
                        $scope.input.o_totalPrice = total_count.substring(0, total_count.indexOf(".") + 3);  //提交总价
                        $scope.input.Json_TotalPrice = JSON.stringify(excess);  //商品ID集
                        $scope.focus = JSON.stringify(excess);  //商品ID集
                        if (Number(total) > Number(orders[0]._Freight)) {  //是否免运费
                            $scope.input.o_freeFreight = 1;   ////免运费
                        } else {
                            $scope.input.o_freeFreight = 0;
                        }
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
                $scope.orders = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //获取发票信息和备注信息
    function getInfomation() {
        HttpFact.user.GET(domain + "/api/Order/get_invoice_and_remark?ProvA_Id=" + $stateParams.id).then(
          function (data) {
              switch (data.res_Code) {
                  case 0:
                      $timeout(function () {
                          $ionicScrollDelegate.resize();
                          $scope.$broadcast("scroll.infiniteScrollComplete");
                      }, 500);
                      break;
                  case 1:
                      $scope.information = data.res_Msg;
                      $timeout(function () {
                          $ionicScrollDelegate.resize();
                          $scope.$broadcast("scroll.infiniteScrollComplete");
                      }, 500);
                      break;
              }
          },
          function (data) {
              $scope.information = []
          }
      )
    }
    //获取默认地址
    function getDefault() {
        HttpFact.user.GET(domain + "/api/Order/get_Acquiescent_address").then(
          function (data) {
              switch (data.res_Code) {
                  case 0:
                      $timeout(function () {
                          $ionicScrollDelegate.resize();
                          $scope.$broadcast("scroll.infiniteScrollComplete");
                      }, 500);
                      break;
                  case 1:
                      $scope.defaultAddress = data.res_Msg;
                      //console.log($scope.defaultAddress)
                      $timeout(function () {
                          $ionicScrollDelegate.resize();
                          $scope.$broadcast("scroll.infiniteScrollComplete");
                      }, 500);
                      break;
              }
          }
      )
    }
    //下订单
    function pay() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Add_OrderList", $scope.input).then(
           function (data) {
               LoadingFact.hide();
               switch (data.res_Code) {
                   case 0:
                       PopupFact.alert("下单失败");
                       $timeout(function () {
                           $ionicScrollDelegate.resize();
                           $scope.$broadcast("scroll.infiniteScrollComplete");
                       }, 500);
                       break;
                   case 1:
                       PopupFact.alert("下单成功,去支付");

                       $scope.orderId = Number(data.res_Msg);  //订单ID
                       console.log($scope.orderId)
                       $scope.getBasic();
                       $timeout(function () {
                           ModalFact.show($scope, "/templates/model/pay.html");
                           $ionicScrollDelegate.resize();
                           $scope.$broadcast("scroll.infiniteScrollComplete");
                       }, 2000);
                       break;
               }
           }
       )
    }

    //请求订单基本信息
    $scope.getBasic = function () {
        LoadingFact.show();
        console.log($scope.input.OrderId)
        HttpFact.user.GET(domain + "/api/Order/get_OrderDetail_Basic?OrderId=" + $scope.orderId).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
                switch (data.res_Code) {
                    case 1:
                        basic = data.res_Msg[0];
                        $scope.basic = basic;
                        break;
                    case 0:
                        break;
                }
            },
            function (data) {
                $scope.basic = {}
                LoadingFact.hide();
            }
        )
    }

    //立即下单
    $scope.confirm_pay = function (infomation, defaultAddress) {
        console.log(infomation)
        console.log(defaultAddress)
        if (infomation[0].sc_Address_status != '') {
            $scope.input.o_reciever = infomation[0].sc_linkman;   //联系人
            $scope.input.o_phone = infomation[0].sc_phone;   //电话
            $scope.input.o_prov = Number(infomation[0].sc_ProId); //收货省份
            $scope.input.o_city = Number(infomation[0].sc_cityId);  //收货市
            $scope.input.o_dist = Number(infomation[0].sc_distId);   //收货区
            $scope.input.o_detailAddr = infomation[0].sc_detailaddress;  //收货详细地址
        } else {
            if (defaultAddress.length <= 0) {
                PopupFact.alert("请添加收货地址")
                return;
            } else {
                $scope.input.o_prov = Number(defaultAddress[0].a_provId);   //收货省份
                $scope.input.o_city = Number(defaultAddress[0].a_cityId);    //收货市
                $scope.input.o_dist = Number(defaultAddress[0].a_distId);   //收货区
                $scope.input.o_detailAddr = defaultAddress[0].a_detailAddr;   //收货详细地址
                $scope.input.o_reciever = defaultAddress[0].a_name;    //收货人
                $scope.input.o_phone = defaultAddress[0].a_phone;  //电话
            }
        }
        if (infomation[0].sc_Address_status == '') {
            $scope.input.o_recieverWay = 1;
        } else {
            $scope.input.o_recieverWay = infomation[0].sc_Address_status;   //收货方式  1:买家地址2：字提地址
        }
        if (infomation[0].sc_type == '1') {
            $scope.input.o_invoice = '个人、' + infomation[0].shopping_invoice;    //发票
        }
        else if (infomation[0].sc_type == '2') {
            $scope.input.o_invoice = '单位、' + infomation[0].shopping_invoice;    //发票
        } else {
            $scope.input.o_invoice = infomation[0].shopping_invoice;    //发票
        }
        $scope.input.o_remark = infomation[0].shopping_remark;    //备注
        pay();
    }
    //支付请求
    function goPay() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/pay_Order", { orderId: $scope.orderId }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 1:
                        PopupFact.alert("支付成功");
                        $timeout(function () {
                            ModalFact.hide();
                            $scope.check.some = '';
                        }, 500);
                        break;
                    case 0:
                        PopupFact.alert("提示", "支付失败，请重新支付", "location.href = location.href");
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData();  //进货单内容数据
        getDefault(); //获取默认地址信息
    });
    //视图进入前加载读取数据
    $scope.$on("$ionicView.beforeEnter", function () {
        getInfomation(); //获取发票信息和备注信息
        //getBasic();
    });

    $scope.open = function () {

    };
    //关闭弹框
    $scope.close = function () {
        ModalFact.hide();
        $state.go('orders')
    };

    //选择支付方式
    $scope.checked_pay = function (value) {
        $scope.check.some = value;
        switch (value) {
            case 0:
                goPay()
                break;
            case 1:
                goPay()
                break;
            case 2:
                goPay()
                break;
        }
    }
})

//选择发票信息
.controller('invoiceController', function ($scope, $rootScope, $stateParams, $state, $location, $timeout, loginJumpFact, HttpFact, PopupFact, LoadingFact) {
    loginJumpFact.tokenJudge("invoice");
    $scope.input = {
        invoice: '',
        genre: 1,
        type: 1
    }

    //发票内容
    $scope.active = function (key, value) {
        $scope.input[key] = value;
    }
    //发票抬头
    $scope.checked = function (key, value) {
        $scope.input[key] = value;
    }

    //确定
    $scope.confirm_action = function () {
        if ($scope.input.type == 1) {
            $scope.input.genre = 0;
            var submit = {
                type: Number($scope.input.genre),
                ProvA_Id: Number($stateParams.id),
                invoice_content: $scope.input.invoice
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Add_shopping_invoice", submit).then(
                function (data) {
                    LoadingFact.hide();
                    switch (data.res_Code) {
                        case 0:
                            break;
                        case 1:
                            $timeout(function () {
                                window.history.back();
                            }, 1000);
                            break;
                    }
                },
                 function (data) {
                     LoadingFact.hide();
                     $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
                 }
            )
        }
        if ($scope.input.type == 2) {
            if ($scope.input.genre == 1) {
                $scope.input.invoice == ''
            }
            if ($scope.input.genre == 2) {
                if ($scope.input.invoice == '' || $scope.input.invoice == null) {
                    PopupFact.alert("单位名称不能为空");
                }
            }
            var submit = {
                type: Number($scope.input.genre),
                ProvA_Id: Number($stateParams.id),
                invoice_content: $scope.input.invoice
            }
            LoadingFact.show();
            HttpFact.user.POST(domain + "/api/Order/Add_shopping_invoice", submit).then(
                function (data) {
                    LoadingFact.hide();
                    switch (data.res_Code) {
                        case 0:
                            break;
                        case 1:
                            $timeout(function () {
                                window.history.back();
                            }, 1000);
                            break;
                    }
                },
                 function (data) {
                     LoadingFact.hide();
                     $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
                 }
            )
        }
    }

})

//选择取货方式
.controller('pickupController', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicPopover, $ionicSlideBoxDelegate, $ionicModal, $ionicScrollDelegate, loginJumpFact, HttpFact, PopupFact, ModalFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.select = {}
    $scope.addresses = [];
    $scope.is_agree = function () {
        $scope.input.isDefault = !$scope.input.isDefault;
    };
    $scope.types = {
        ProvA_Id: $stateParams.id,
        status: '',
        province: '',
        city: '',
        dist: '',
        detailAddress: '',
        linkman: '',
        phone: ''
    }   //取货方式
    //选中地址
    $scope.pro = {
        checked: ''
    };
    var pickups = [];  //取货地址
    $scope.pickups = [];
    var toSelf = [];   //自行取货
    $scope.toSelf = [];
    var address_id;  //参数
    $scope.Number = Number;
    //地址设为默认点击事件

    $scope.is_pick = function (obj, key, value) {
        $scope.pro.checked = obj.a_id;  //选中状态
        //console.log(obj)
        if (key == '1') {
            $scope.types = {
                ProvA_Id: Number($stateParams.id),
                status: Number(key),
                province: Number(obj.a_provId),
                city: Number(obj.a_cityId),
                dist: Number(obj.a_distId),
                detailAddress: obj.a_detailAddr,
                linkman: obj.a_name,
                phone: obj.a_phone
            }
        } else {
            $scope.types = {
                ProvA_Id: Number($stateParams.id),
                status: Number(key),
                province: Number(obj._provId),
                city: Number(obj._cityId),
                dist: Number(obj._distId),
                detailAddress: obj._detailAddr,
                linkman: obj._landLine,
                phone: obj._phone
            }
        }
        $scope.save_address();
    }

    //保存收货地址
    $scope.save_address = function () {
        HttpFact.user.POST(domain + "/api/Order/update_shoppingCart_address", $scope.types).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        PopupFact.alert("保存收货地址失败");
                        break;
                    case 1:
                        $timeout(function () {
                            window.history.back();
                        }, 500);
                        break;
                }
            },
             function (data) {
                 $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
             }
        )
    }

    //获取地址列表
    function getAddress() {
        HttpFact.user.GET(domain + "/api/User/addressList").then(
            function (data) {
                $scope.pickups = JSON.parse(data);
                //console.log($scope.pickups)
            },
             function (data) {
                 $scope.pickups = [];
                 $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
             }
        )
    }

    //自行取货获取数据
    function self_pickup() {
        HttpFact.get(domain + "/api/Order/get_provAgent_address?id=" + $stateParams.id).then(
             function (data) {
                 //console.log(data)
                 switch (data.res_Code) {
                     case 0:
                         //PopupFact.alert("","数据有误，请刷新", "location.href = location.href")
                         break;
                     case 1:
                         toSelf = data.res_Msg[0];
                         $scope.toSelf = toSelf;
                         break;
                 }
             }
        )
    }
    //添加地址
    $ionicModal.fromTemplateUrl("/templates/model/addAddress.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.addAddress = function () {
        $scope.modal.show();
    }
    $scope.close = function () {
        $scope.modal.hide();
    }
    $scope.add_address = function () {
        $scope.modal.hide();
    }

    //获取省份的参数
    var id = 0;
    var addrType = 1;
    //地址选择
    $scope.address = "";
    //$scope.cityList = $scope.provinceData;
    //$scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = '';
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        //$scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (key, value, name) {
        $scope.input.s_storeProv = Number(value);
        addrType = Number(key);
        id = Number(value)
        $scope.getCity();
        $scope.address += name;
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (key, value, name) {
        $scope.input.s_storeCity = Number(value);
        addrType = Number(key);
        id = Number(value)
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                areas = JSON.parse(data);
                //console.log($scope.areas);
                for (var i = 0; i < $scope.citys.length; i++) {
                    if ($scope.citys[i].name == name) {
                        if ($scope.areas == '' || $scope.areas == null) {
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.select.City = "";
                            $scope.select.City = $scope.address;
                            $scope.address = "";
                            $scope.cityOkModal();
                        } else {
                            $scope.getArea();
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.areas = $scope.citys[i].name;
                            $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                        };
                        break;
                    }
                };
            },
            function (data) {

            }
         )
    };

    //区（县）事件
    $scope.areaEvent = function (value, name) {
        $scope.input.s_storeDist = Number(value);
        $scope.address += name;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };
    //打开地址选择框
    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
        $scope.getProvince();
    }
    //获取省份
    $scope.getProvince = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.provinces = JSON.parse(data);
                //console.log($scope.provinces)
            }
         )
    }
    //获取城市
    $scope.getCity = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.citys = JSON.parse(data);
                //console.log($scope.citys)
            }
         )
    }
    //获取区县
    $scope.getArea = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                //areas = JSON.parse(data);
                //console.log($scope.areas)
            }
         )
    }


    //添加收货地址
    $scope.add_address = function () {
        HttpFact.user.POST(domain + "/api/User/addressAdd", $scope.input).then(
            function (data) {
                if (data == "1") {
                    //$timeout(function () {
                    //    $scope.modal.hide();
                    //}, 500);
                    PopupFact.alert("提示", "添加成功", "location.href = location.href")
                } else {
                    PopupFact.alert("提示", "添加失败")
                }
            },
            function (data) {
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.beforeEnter", function () {
        getAddress();  //获取地址列表
        self_pickup();  //自行取货
    });

})

//备注信息
.controller('remarksController', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicPopover, $ionicScrollDelegate, loginJumpFact, PopupFact, HttpFact) {
    $scope.input = {
        remark: ''
    }
    //确定
    $scope.confirm = function () {
        if ($scope.input.remark == '' || $scope.input.remark == null) {
            PopupFact.alert("备注信息不能为空");
        }
        var submit = {
            ProvA_Id: Number($stateParams.id),
            remark_content: $scope.input.remark
        }
        HttpFact.user.POST(domain + "/api/Order/Add_shopping_remark", submit).then(
                function (data) {
                    console.log(data)
                    switch (data.res_Code) {
                        case 0:
                            PopupFact.alert("备注信息不能为空");
                            break;
                        case 1:
                            $timeout(function () {
                                window.history.back();
                            }, 1000);
                            $scope.input.remark = '';
                            break;
                    }
                },
                 function (data) {
                     $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
                 }
            )

    }
})

//订单--地址管理
.controller('addressSuperviseController', function ($scope, $state, $rootScope, LoadingFact, $timeout, HttpFact, ModalFact, PopupFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.check = {}
    $scope.input.deleteId = '';
    $scope.addresses = [];
    //地址列表
    function getAddressList() {
        HttpFact.user.GET(domain + "/api/User/addressList").then(
            function (data) {
                $scope.addresses = JSON.parse(data);

            },
            function (data) {
                $scope.addresses = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //滑动删除事件
    $scope.flag = { showDelete: false };
    //滑动删除
    $scope.remove = function (value, key) {

        HttpFact.user.GET(domain + "/api/User/addressDelete?id=" + value).then(
            function (data) {
                if (data == '1') {
                    $scope.addresses.splice($scope.addresses.indexOf(key), 1);
                    getAddressList()
                } else {
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
                $scope.addressDefault = JSON.parse(data);
                // console.log($scope.addressDefault)
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
    //订单详情
.controller('ordersDetailController', function ($scope, $rootScope, $state, $stateParams, $ionicPopover, $timeout, $ionicScrollDelegate, loginJumpFact, LoadingFact, HttpFact) {
    loginJumpFact.tokenJudge("ordersDetail");
    $scope.input = {}
    $scope.input.id = $stateParams.id;
    console.log($scope.input.id)
    var basic = [];  //基本信息
    $scope.basic = [];
    var orders = []; //商品信息
    $scope.orders = [];
    //获取订单详情的基本信息
    function getBasic() {
        LoadingFact.show();
        HttpFact.user.GET(domain + "/api/Order/get_OrderDetail_Basic?OrderId=" + $stateParams.id).then(
           function (data) {
               LoadingFact.hide();
               switch (data.res_Code) {
                   case 0:
                       $scope.basic = [];
                       $timeout(function () {
                           $ionicScrollDelegate.resize();
                           $scope.$broadcast("scroll.infiniteScrollComplete");
                       }, 500);
                       break;
                   case 1:
                       basic = data.res_Msg[0];
                       $scope.basic = basic;
                       $scope.input.add_time = basic.o_addTime.split("/").join("-");
                       $scope.input.success_time = basic.p_successTime.split("/").join("-");
                       $scope.input.send_time = basic.o_sendTime.split("/").join("-");
                       $scope.input.receive_time = basic.o_ReceiveTime.split("/").join("-");
                       $timeout(function () {
                           $ionicScrollDelegate.resize();
                           $scope.$broadcast("scroll.infiniteScrollComplete");
                       }, 500);
                       break;
               }
           },
           function (data) {
               LoadingFact.hide();
               $scope.basic = [];
               $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
           }
       )
    }
    //获取订单详情的商品信息
    function getOrders() {
        LoadingFact.show();
        HttpFact.user.GET(domain + "/api/Order/get_OrderDetail_content?OrderId=" + $stateParams.id).then(
           function (data) {
               LoadingFact.hide();
               switch (data.res_Code) {
                   case 0:
                       $scope.orders = orders;
                       $timeout(function () {
                           $ionicScrollDelegate.resize();
                           $scope.$broadcast("scroll.infiniteScrollComplete");
                       }, 500);
                       break;
                   case 1:
                       orders = data.res_Msg;
                       $scope.orders = orders;
                       $timeout(function () {
                           $ionicScrollDelegate.resize();
                           $scope.$broadcast("scroll.infiniteScrollComplete");
                       }, 500);
                       break;
               }
           },
           function () {
               LoadingFact.hide();
               $scope.orders = [];
               $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
           }
       )
    }

    // 确认收货
    $scope.confirm_action = function () {
        $scope.up_model();
    }
    // 确认收货数据请求
    $scope.up_model = function () {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Confirm_Goods", { orderId: Number($stateParams.id) }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 0:
                        PopupFact.show("提示", "确认收货失败");
                        break;
                    case 1:
                        $scope.up.show();
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
            }
        )
    }
    $ionicPopover.fromTemplateUrl("/templates/model/proPrompt.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $ionicPopover.fromTemplateUrl("/templates/model/success.html", {
        scope: $scope
    }).then(function (up) {
        $scope.up = up;
    })
    $scope.open = function () {
        $scope.up.show();
    }
    $scope.close = function () {
        $scope.up.hide();
    };

    $scope.proReplace = function () {
        $scope.popover.remove();
        $state.go("replaceGoods");
    }

    $scope.exchange = function () {
        $scope.popover.remove();
        $state.go("backGoods");
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getBasic();  //获取订单详情的基本信息
        getOrders();  //获取订单详情的商品信息
    });

})

//退货详情
.controller('returnsDetailController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("returnsDetail");
    $scope.proData = [{
        name: "深圳罗技电子科技有限公司",
        goods: [{
            id: 1,
            tradeName: "Beats Solo1 无线头戴式耳机",
            amount: "￥" + 198.00,
            color: "黑色",
            edition: "普通版"
        }]
    }]
})
//会员中心--我的评价
.controller('commentController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, $timeout, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge(location.href);
    var judges = [];
    $scope.judges = [];
    var page = 1;
    var size = 7;
    $scope.noData = true;

    function getComment(page, size) {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
        }
        HttpFact.user.POST(domain + "/api/User/get_My_CommentList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.judges = judges;
                        isPull = false;
                        $scope.noData = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                    case -1:
                        $scope.judges = judges;
                        isPull = false;
                        $scope.noData = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        var Data;
                        Data = JSON.parse(data.res_Msg);
                        judges = judges.concat(Data[0].list);
                        $scope.judges = judges;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (Data[0].list.length < size) {
                                isPull = false;
                                $scope.noData = false;
                            }

                            else {
                                isPull = true;
                                $scope.noData = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.judges = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getComment(page, size)
    });
    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getComment(page, size);
    }

})

//评价详情
.controller('commentDetailController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, $stateParams, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge("comment");
    $scope.input = {}
    function getCommentDetail(Id) {
        HttpFact.user.POST(domain + "/api/User/get_My_CommentDetail", { com_Id: Id }).then(
            function (data) {
                $scope.regard = data.res_Msg;
            },
            function (data) {
                $scope.input = {};
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getCommentDetail($stateParams.Id)
    });
})

//会员中心
.controller('userController', function ($scope, $rootScope, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.user = [];
    //获取用户信息
    function getUser() {
        HttpFact.user.GET(domain + "/api/User/getUserInfo").then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        break;
                    case 1:
                        $scope.user = data.res_Msg[0];
                        break;
                }
            },
            function (data) {
                $scope.user = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //获取购物车商品个数
    function getNumber() {
        HttpFact.user.GET(domain + "/api/User/get_no_reader_message").then(
            function (data) {
                $scope.number = data.res_Msg;
                //console.log(data)
            }
        )
    }

    //订单跳转
    $scope.go = function (url) {
        location.href = url;
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getNumber();
    });

    $scope.$on("$ionicView.afterEnter", function () {
        getUser();
    })
})

//会员中心--待评价列表
.controller('stayGradeController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, $stateParams, loginJumpFact, HttpFact, PopupFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.opinions = [];
    var page = 1;
    var size = 7;
    $scope.noData = true;

    function getStayGrade(page, size) {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
            orderId: Number($stateParams.Id)
        }
        HttpFact.user.POST(domain + "/api/Order/get_Order_CommentList", submit).then(
            function (data) {
                Data = JSON.parse(data.res_Msg);
                console.log(Data)
                pageCount = Number(Data[0].pageCount);
                pageNow = Number(Data[0].pageNow);

                if (pageCount < pageNow) {
                    $scope.noData = false;
                } else if (pageCount == pageNow) {
                    $scope.opinions = $scope.opinions.concat(Data[0].list);
                    $scope.noData = false;
                    console.log($scope.opinions)
                } else {
                    $scope.opinions = $scope.opinions.concat(Data[0].list);
                    // console.log($scope.opinions)
                };

                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.opinions = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getStayGrade(page, size)
    });
    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getStayGrade(page, size);
    }
})

//确认收货--待评价列表
.controller('judgeController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, $stateParams, loginJumpFact, HttpFact, PopupFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.opinions = [];
    var page = 1;
    var size = 7;
    $scope.noData = true;

    function getStayGrade(page, size) {
        var submit = {
            current: page, //当前页数
            count: size, //单页条数
            orderId: Number($stateParams.id)
        }
        HttpFact.user.POST(domain + "/api/Order/get_Order_CommentList", submit).then(
            function (data) {
                Data = JSON.parse(data.res_Msg);
                console.log(Data)
                pageCount = Number(Data[0].pageCount);
                pageNow = Number(Data[0].pageNow);

                if (pageCount < pageNow) {
                    $scope.noData = false;
                } else if (pageCount == pageNow) {
                    $scope.opinions = $scope.opinions.concat(Data[0].list);
                    $scope.noData = false;
                    console.log($scope.opinions)
                } else {
                    $scope.opinions = $scope.opinions.concat(Data[0].list);
                    // console.log($scope.opinions)
                };

                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.opinions = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getStayGrade(page, size)
    });
    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getStayGrade(page, size);
    }
})
//会员中心--全部订单
.controller('allOrdersController', function ($scope, $rootScope, $ionicPopup, $stateParams, $ionicPopover, $timeout, $ionicScrollDelegate, $ionicHistory, $ionicSlideBoxDelegate, HttpFact, loginJumpFact, PopupFact, LoadingFact, ModalFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {};
    var basic = {}   //订单基本信息
    $scope.basic = {}
    $scope.check = {
        some: ''
    } ///选择支付方式
    //每次进入视图都执行
    $scope.$on("$ionicView.beforeEnter", function () {
        $ionicHistory.clearHistory();
        $ionicScrollDelegate.$getByHandle('switchHandle').resize();
        $ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    });
    //顶部切换
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }
    $scope.De_Switch.proIndex = $stateParams.type;
    $scope.De_Switch.get($stateParams.type);
    $scope.De_Switch.set($stateParams.type);
    // 确认收货弹出框
    $ionicPopover.fromTemplateUrl("/templates/model/sure.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    //关闭确认事件
    $scope.closeConfirm = function () {
        $scope.popover.hide();
    };
    //确认收货事件
    $scope.order_id = 0;
    $scope.isConfirm = function (id) {
        $scope.popover.show();
        $scope.order_id = Number(id);
    }
    // 确认收货
    $scope.confirm_action = function () {
        $scope.popover.hide();
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Confirm_Goods", { orderId: $scope.order_id }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 1:
                        for (var i = 0; i < $scope.sends.length; i++) {
                            if ($scope.order_id == $scope.sends[i].o_id) {
                                $scope.sends.splice(i, 1);
                            }
                        };
                        for (var i = 0; i < $scope.collects.length; i++) {
                            if ($scope.order_id == $scope.collects[i].o_id) {
                                $scope.collects.splice(i, 1);
                            }
                        };
                        break;
                    case 0:
                        PopupFact.show("提示", "确认收货失败");
                        break;
                }
            }
        )
    }
    //取消代付款订单数据请求
    function detele_orders() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Delete_OrderList", { orderId: Number($scope.orders_id) }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 1:
                        PopupFact.alert("取消订单成功");
                        for (var i = 0; i < $scope.payings.length; i++) {
                            if ($scope.orders_id == $scope.payings[i].o_id) {
                                $scope.payings.splice(i, 1);
                            }
                        };
                        for (var i = 0; i < $scope.coupons.length; i++) {
                            if ($scope.orders_id == $scope.coupons[i].o_id) {
                                $scope.coupons.splice(i, 1);
                            }
                        };
                        $timeout(function () {
                            $ionicScrollDelegate.$getByHandle('small').resize();
                        }, 500);
                        break;
                    case 0:
                        PopupFact.alert("取消订单失败");
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
            }
        )
    }
    //取消代付款订单
    $scope.orders_id = {}
    $scope.delete_confirm = function (id) {
        $ionicScrollDelegate.$getByHandle('small').resize();
        $scope.orders_id = id;
        console.log(id)
        detele_orders()
    }
    //删除待评价订单
    $scope.delete_review = function (id) {
        $scope.orders_id = id;
        detele_review()
    }
    //删除待评价订单
    function detele_review() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/Delete_Order_comment", { orderParamId: Number($scope.orders_id) }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 1:
                        PopupFact.alert("删除订单成功");
                        $timeout(function () {
                            $ionicScrollDelegate.$getByHandle('small').resize();
                            for (var i = 0; i < $scope.reviews.length; i++) {
                                if ($scope.orders_id == $scope.reviews[i].o_id) {
                                    $scope.reviews.splice(i, 1);
                                }
                            };
                        }, 1000)
                        break;
                    case 0:
                        PopupFact.alert("删除订单失败");
                        break;
                }
            }
        )
    }

    //支付
    $scope.pay = function (id) {
        ModalFact.show($scope, "/templates/model/Payment.html");
        $scope.input.orderId = Number(id);
        $scope.input.OrderId = Number(id);
        $scope.getBasic();
    }
    //$scope.confirm_pay = function () {
    //    goPay()
    //}
    $scope.close = function () {
        ModalFact.hide()
    }
    //选择支付方式
    $scope.checked_pay = function (value) {
        $scope.check.some = value;
        switch (value) {
            case 0:
                goPay()
                break;
            case 1:
                goPay()
                break;
            case 2:
                goPay()
                break;
        }
    }
    //支付请求
    function goPay() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/Order/pay_Order", { orderId: $scope.input.orderId }).then(
            function (data) {
                LoadingFact.hide();
                switch (data.res_Code) {
                    case 1:
                        PopupFact.alert("支付成功");
                        $timeout(function () {
                            ModalFact.hide();
                            $scope.check.some = '';
                        }, 3000);
                        break;
                    case 0:
                        PopupFact.alert("提示", "支付失败，请重新支付", "location.href = location.href");
                        break;
                }
            },
            function (data) {
                LoadingFact.hide();
            }
        )
    }
    var pages = [{ page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }];
    var size = 10;
    var payings = [];   //待支付
    $scope.payings = [];
    var sends = [];   //待发货
    $scope.sends = [];
    var collects = [];   //待收货
    $scope.collects = [];
    var reviews = [];   //待评价
    $scope.reviews = [];
    var coupons = []; //全部订单
    $scope.coupons = [];
    var isPull = false; //是否启动上拉加载
    $scope.noData = true;
    $scope.noData1 = true;
    $scope.noData2 = true;
    $scope.noData3 = true;
    $scope.noData4 = true;
    $scope.get = {
        // 待付款
        getStay: function (page, size) {
            var submit = {
                current: page, //当前页数
                count: size, //单页条数
                status: 0
            }
            HttpFact.user.POST(domain + "/api/Order/Wait_Pay", submit).then(
                function (data) {
                    switch (data.res_Code) {
                        case 0:
                            $scope.payings = payings;
                            $scope.noData = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                        case -1:
                            $scope.payings = payings;
                            $scope.noData = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case 1:
                            var Data = [];
                            Data = JSON.parse(data.res_Msg.m_StringValue);
                            payings = payings.concat(Data.MobList);
                            $scope.payings = payings;
                            console.log($scope.payings)
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                                if (Data.MobList.length < size) {
                                    $scope.noData = false;
                                }
                                else {
                                    $scope.noData = true;
                                }
                            }, 500);
                            break;
                    }
                },
                function (data) {
                    $scope.payings = [];
                    $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
                }
            )
        },

        //待发货
        getSend: function (page, size) {
            var submit = {
                current: page, //当前页数
                count: size, //单页条数
                status: 1
            }
            HttpFact.user.POST(domain + "/api/Order/Send_Goods", submit).then(
                function (data) {
                    switch (data.res_Code) {
                        case 0:
                            $scope.sends = sends;
                            $scope.noData1 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                        case -1:
                            $scope.sends = sends;
                            $scope.noData1 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case 1:
                            var Data = []
                            Data = JSON.parse(data.res_Msg.m_StringValue);
                            sends = sends.concat(Data.MobList);
                            $scope.sends = sends;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                                if (Data.MobList.length < size) {
                                    $scope.noData1 = false;
                                }

                                else {
                                    $scope.noData1 = true;
                                }
                            }, 500);
                            break;
                    }
                },
                function (data) {
                    $scope.sends = [];
                    $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
                }
            )
        },

        // 待收货
        getCollect: function (page, size) {
            var submit = {
                current: page, //当前页数
                count: size, //单页条数
                status: 2
            }
            HttpFact.user.POST(domain + "/api/Order/Wait_Goods", submit).then(
                function (data) {
                    switch (data.res_Code) {
                        case 0:
                            $scope.collects = collects;
                            $scope.noData2 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                        case -1:
                            $scope.collects = collects;
                            isPull = false;
                            $scope.noData2 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case 1:
                            Data = JSON.parse(data.res_Msg.m_StringValue);
                            collects = collects.concat(Data.MobList[0]);
                            $scope.collects = collects;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                                if (Data.MobList.length < size) {
                                    $scope.noData2 = false;
                                }
                                else {
                                    $scope.noData2 = true;
                                }
                            }, 500);
                            break;
                    }
                },
                function (data) {
                    $scope.collects = [];
                    $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
                }
            )
        },

        //待评价
        getReview: function (page, size) {
            var submit = {
                current: page, //当前页数
                count: size, //单页条数
            }
            HttpFact.user.POST(domain + "/api/Order/Wait_Comment", submit).then(
                function (data) {
                    switch (data.res_Code) {
                        case 0:
                            $scope.reviews = reviews;
                            $scope.noData3 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case -1:
                            $scope.reviews = reviews;
                            isPull = false;
                            $scope.noData3 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case 1:
                            var Data;
                            Data = JSON.parse(data.res_Msg);
                            reviews = reviews.concat(Data[0].list);
                            $scope.reviews = reviews;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                                if (Data[0].list.length < size) {
                                    $scope.noData3 = false;
                                }
                                else {
                                    $scope.noData3 = true;
                                }
                            }, 500);
                            break;
                    }
                },
                 function (data) {
                     $scope.reviews = [];
                     $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
                 }
            )
        },

        //全部订单
        getAll: function (page, size) {
            var submit = {
                current: page, //当前页数
                count: size, //单页条数
                status: 4
            }
            HttpFact.user.POST(domain + "/api/Order/ALL_OrderLists", submit).then(
                function (data) {
                    switch (data.res_Code) {
                        case 0:
                            $scope.coupons = coupons;
                            $scope.noData4 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case -1:
                            $scope.coupons = coupons;
                            isPull = false;
                            $scope.noData4 = false;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                            }, 500);
                            break;
                        case 1:
                            var Data;
                            Data = JSON.parse(data.res_Msg.m_StringValue);
                            coupons = coupons.concat(Data.MobList);
                            $scope.coupons = coupons;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                                if (Data.MobList.length < size) {
                                    $scope.noData4 = false;
                                }
                                else {
                                    $scope.noData4 = true;
                                }
                            }, 500);
                            break;
                    }
                },
                function (data) {
                    $scope.coupons = [];
                    $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
                }
            )
        }
    }

    //请求订单基本信息
    $scope.getBasic = function() {
        LoadingFact.show();
        console.log($scope.input.OrderId)
        HttpFact.user.GET(domain + "/api/Order/get_OrderDetail_Basic?OrderId=" + $scope.input.OrderId).then(
            function (data) {
                LoadingFact.hide();
                console.log(data)
                switch (data.res_Code) {
                    case 1:
                        basic = data.res_Msg[0];
                        $scope.basic = basic;
                        break;
                    case 0:
                        break;
                }
            },
            function (data) {
                $scope.basic = {}
                LoadingFact.hide();
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        $scope.get.getStay(pages[0].page, size);
        $scope.get.getSend(pages[1].page, size);
        $scope.get.getCollect(pages[2].page, size);
        $scope.get.getReview(pages[3].page, size);
        $scope.get.getAll(pages[4].page, size);
    });
    //视图进入前加载读取数据
    $scope.$on("$ionicView.beforeEnter", function () {
        //getBasic();
    });
    //加载数据事件
    $scope.loadMore = function (value) {
        switch (value) {
            case 0:
                pages[0].page++;
                $scope.get.getStay(pages[0].page, size);
                break;
            case 1:
                pages[1].page++;
                $scope.get.getSend(pages[1].page, size);
                break;
            case 2:
                pages[2].page++;
                $scope.get.getCollect(pages[2].page, size);
                break;
            case 3:
                pages[3].page++;
                $scope.get.getReview(pages[3].page, size);
                break;
            case 4:
                pages[4].page++;
                $scope.get.getAll(pages[4].page, size);
                break;
        }
    }
})

//会员中心--评价
.controller('opinionController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, $stateParams, $state, loginJumpFact, HttpFact, PopupFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {
        orderParamId: '',
        productId: '',
        paramId: '',
        c_content: '',
        c_level: ''
    }
    $scope.orders = {};
    //星级评分
    $scope.check_action = function (value) {
        $scope.input.c_level = value;
    }

    //获取订单数据
    function getOrders(Id) {
        var submit = {
            op_id: Id
        }
        HttpFact.user.POST(domain + "/api/Order/get_Products_Commnet", { orderParamId: Number(Id) }).then(
            function (data) {
                $scope.orders = data.res_Msg[0];
                $scope.input.orderParamId = Number(data.res_Msg[0]._id);
                $scope.input.productId = Number(data.res_Msg[0].oductsId);
                $scope.input.paramId = Number(data.res_Msg[0].ramId);
                console.log($scope.orders)
            },
            function (data) {
                $scope.orders = {};
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    $scope.submit_acition = function () {
        HttpFact.user.POST(domain + "/api/Order/Add_Product_comment", $scope.input).then(
            function (data) {
                console.log(data)
                switch (data.res_Code) {
                    case -1:
                        PopupFact.alert("提示", "评价失败");
                        break;
                    case 1:
                        PopupFact.alert("提示", "评价成功", "$state.go('allOrders')");
                        break;
                    case 0:
                        PopupFact.alert("提示", "你已经评价过该商品了");
                        break;
                    default:
                        break;
                }
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getOrders($stateParams.Id)
    })
})

//会员中心--账户设置
.controller('basicDataController', function ($scope, $rootScope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, loginJumpFact, ModalFact, HttpFact, PopupFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {}
    $scope.select = {

    }
    $scope.input = { Sex: 1 };
    $scope.single_check = function (name, value) {

        $scope.input[name] = value;
    }

    //身份选择
    $scope.identities = [{
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
    }]

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
                } else {
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
                $scope.input.Sex = Number(data.res_Msg[0].sex);
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

            },
             function (data) {
                 $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
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
                } else {
                    PopupFact.alert("提示", "修改账户基本信息失败")
                }
                console.log(data)
            },
             function (data) {
                 $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
             }
        )
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getSigninInfo()
    });
})

//退出登录
.controller('accountSettingController', function ($scope, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.signout = function () {
        localStorage.removeItem("User-Token");
        location.href = location.href;
    }
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

//设置头像
.controller('avatarSettingsController', function ($scope, $rootScope, HttpFact, LoadingFact, loginJumpFact) {

    loginJumpFact.tokenJudge("avatarSettings");

    //图片上传插件
    function dropify() {
        $(document).ready(function () {
            // Basic
            $('.dropify').dropify();
            // Translated
            $('.dropify-fr').dropify({
                messages: {
                    default: '点击文件到这里',
                    replace: '点击文件到这里来替换文件',
                    remove: '移除文件',
                    error: '对不起，你上传的文件太大了'
                }
            });

            // Used events
            var drEvent = $('#input-file-events').dropify();

            drEvent.on('dropify.beforeClear', function (event, element) {
                return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
                console.log(drEvent);
            });

            drEvent.on('dropify.afterClear', function (event, element) {
                alert('File deleted');
            });

            drEvent.on('dropify.errors', function (event, element) {
                console.log('Has Errors');
            });

            var drDestroy = $('#input-file-to-destroy').dropify();
            drDestroy = drDestroy.data('dropify')
            $('#toggleDropify').on('click', function (e) {
                e.preventDefault();
                if (drDestroy.isDropified()) {
                    drDestroy.destroy();
                } else {
                    drDestroy.init();
                }
            })
        });
    }

    //请求更改数据
    function getAvatar(pic1) {
        var json = {
            pic: pic1
        }
        HttpFact.user.POST(domain + "/api/User/updateUser_Pic", JSON.stringify(json)).then(
            function (data) {
                $scope.pic = data.res_Msg;
            },
             function (data) {
                 $scope.pic = {};
                 $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "数据有误，请刷新重试！", "location.href = location.href")');
             }
        )
    }

    //图片压缩
    function Selector() {
        document.querySelector('#input-file-disable-remove').addEventListener('change', function () {
            LoadingFact.show();
            lrz(this.files[0])
                .then(function (rst) {
                    LoadingFact.hide();
                    var img = new Image();
                    img.src = rst.base64;

                    img.onload = function () {
                        $(".dropify-render").html(img)
                    };
                    return rst;
                })
                .catch(function (err) {
                    // 处理失败会执行
                    alert(1)
                })
                .always(function () {
                    // 不管是成功失败，都会执行
                });
        });
    }

    //修改图片
    $scope.modify = function () {
        var AvatarImg = $(".dropify-render > img").attr("src");
        getAvatar(AvatarImg);
    }

    //获取用户头像
    function getUser() {
        HttpFact.user.GET(domain + "/api/User/getUserInfo").then(
            function (data) {
                $scope.user = data.res_Msg;
            }
        )
    }

    //第一次加载数据
    $scope.$on("$ionicView.loaded", function () {
        dropify();
        Selector();
        getUser();
    });
})


//实名认证
.controller('nameCertificationController', function ($scope) {
    //图片上传
    $(document).ready(function () {
        // Basic
        $('.dropify').dropify();

        // Translated
        $('.dropify-fr').dropify({
            messages: {
                default: 'Glissez-déposez un fichier ici ou cliquez',
                replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                remove: 'Supprimer',
                error: '对不起，你上传的文件太大了'
            }
        });

        // Used events
        var drEvent = $('#input-file-events').dropify();

        drEvent.on('dropify.beforeClear', function (event, element) {
            return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
        });

        drEvent.on('dropify.afterClear', function (event, element) {
            alert('File deleted');
        });

        drEvent.on('dropify.errors', function (event, element) {
            console.log('Has Errors');
        });

        var drDestroy = $('#input-file-to-destroy').dropify();
        drDestroy = drDestroy.data('dropify')
        $('#toggleDropify').on('click', function (e) {
            e.preventDefault();
            if (drDestroy.isDropified()) {
                drDestroy.destroy();
            } else {
                drDestroy.init();
            }
        }) //console.log('')
    });

    //图片压缩
    document.querySelector('#input-file-disable-remove').addEventListener('change', function () {
        lrz(this.files[0])
            .then(function (rst) {
                // 处理成功会执行
                console.log(rst);
            })
            .catch(function (err) {
                // 处理失败会执行
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
    });

})

//账户设置-收货地址管理
.controller('addressManageController', function ($scope, $state, $rootScope, LoadingFact, $timeout, HttpFact, ModalFact, PopupFact, loginJumpFact) {
    loginJumpFact.tokenJudge("addressManage");
    $scope.input = {}
    $scope.input.deleteId = '';
    $scope.addresses = [];
    //地址列表
    function getAddressList() {
        HttpFact.user.GET(domain + "/api/User/addressList").then(
            function (data) {
                $scope.addresses = JSON.parse(data);
               
            },
            function (data) {
                $scope.addresses = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //滑动删除事件
    $scope.flag = { showDelete: false };
    //滑动删除
    $scope.remove = function (value, key) {

        HttpFact.user.GET(domain + "/api/User/addressDelete?id=" + value).then(
            function (data) {
                if (data == '1') {
                    $scope.addresses.splice($scope.addresses.indexOf(key), 1);
                    getAddressList()
                } else {
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
                $scope.addressDefault = JSON.parse(data);
                // console.log($scope.addressDefault)
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
    $scope.select = {}
    $scope.addresses = [];
    $scope.is_agree = function () {
        $scope.input.isDefault = !$scope.input.isDefault;
    };

    //获取省份的参数
    var id = 0;
    var addrType = 1;
    //地址选择
    $scope.address = "";
    //$scope.cityList = $scope.provinceData;
    //$scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = '';
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        //$scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (key, value, name) {
        $scope.input.s_storeProv = Number(value);
        addrType = Number(key);
        id = Number(value)
        $scope.getCity();
        $scope.address += name;
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (key, value, name) {
        $scope.input.s_storeCity = Number(value);
        addrType = Number(key);
        id = Number(value)
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                areas = JSON.parse(data);
                //console.log($scope.areas);
                for (var i = 0; i < $scope.citys.length; i++) {
                    if ($scope.citys[i].name == name) {
                        if ($scope.areas == '' || $scope.areas == null) {
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.select.City = "";
                            $scope.select.City = $scope.address;
                            $scope.address = "";
                            $scope.cityOkModal();
                        } else {
                            $scope.getArea();
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.areas = $scope.citys[i].name;
                            $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                        };
                        break;
                    }
                };
            },
            function (data) {

            }
         )
    };

    //区（县）事件
    $scope.areaEvent = function (value, name) {
        $scope.input.s_storeDist = Number(value);
        $scope.address += name;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };
    //打开地址选择框
    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
        $scope.getProvince();
    }
    //获取省份
    $scope.getProvince = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.provinces = JSON.parse(data);
                //console.log($scope.provinces)
            }
         )
    }
    //获取城市
    $scope.getCity = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.citys = JSON.parse(data);
                //console.log($scope.citys)
            }
         )
    }
    //获取区县
    $scope.getArea = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                //areas = JSON.parse(data);
                //console.log($scope.areas)
            }
         )
    }

    //添加收货地址
    $scope.add_address = function () {
        HttpFact.user.POST(domain + "/api/User/addressAdd", $scope.input).then(
            function (data) {
                if (data == "1") {
                    PopupFact.alert("提示", "添加成功", "$state.go('addressManage')")
                } else {
                    PopupFact.alert("提示", "添加失败")
                }
            },
            function (data) {
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
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
        id: Number($stateParams.Id),
        s_name: '',
        s_phone: '',
        s_telephone: '',
        s_storeProv: '',
        s_storeCity: '',
        s_storeDist: '',
        s_storeDetailAddr: '',
        s_postcode: '',
    }

    //获取省份的参数
    var id = 0;
    var addrType = 1;
    //地址选择
    $scope.address = "";
    //$scope.cityList = $scope.provinceData;
    //$scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = '';
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        //$scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (key, value, name) {
        $scope.input.s_storeProv = Number(value);
        addrType = Number(key);
        id = Number(value)
        $scope.getCity();
        $scope.address += name;
        //$scope.input.s_storeProv = val;
        //$scope.input.s_provId = val
        //for (var i = 0; i < $scope.cityList.length; i++) {
        //    if ($scope.cityList[i].p == val) {
        //        $scope.address += name;
        //        $scope.citys = $scope.cityList[i].c;
        //        break;
        //    };
        //};
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (key, value, name) {
        $scope.input.s_storeCity = Number(value);
        addrType = Number(key);
        id = Number(value)
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                areas = JSON.parse(data);
                console.log($scope.areas);
                for (var i = 0; i < $scope.citys.length; i++) {
                    if ($scope.citys[i].name == name) {
                        if ($scope.areas == '' || $scope.areas == null) {
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.select.City = "";
                            $scope.select.City = $scope.address;
                            $scope.address = "";
                            $scope.cityOkModal();
                        } else {
                            $scope.getArea();
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.areas = $scope.citys[i].name;
                            $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                        };
                        break;
                    }
                };
            },
            function (data) {

            }
         )
    };

    //区（县）事件
    $scope.areaEvent = function (value, name) {
        $scope.input.s_storeDist = Number(value);
        $scope.address += name;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };
    //打开地址选择框
    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
        $scope.getProvince();
    }
    //获取省份
    $scope.getProvince = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.provinces = JSON.parse(data);
                //console.log($scope.provinces)
            }
         )
    }
    //获取城市
    $scope.getCity = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.citys = JSON.parse(data);
                console.log($scope.citys)
            }
         )
    }
    //获取区县
    $scope.getArea = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                areas = JSON.parse(data);
                console.log($scope.areas)
            }
         )
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
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
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
                $scope.input.s_storeProv = Number($scope.data[0].a_provId);
                $scope.input.s_storeCity = Number($scope.data[0].a_cityId);
                $scope.input.s_storeDist = Number($scope.data[0].a_distId);
                if ($scope.data[0].a_prov == $scope.data[0].a_city) {
                    $scope.select.City = $scope.data[0].a_prov + $scope.data[0].a_dist;
                } else {
                    $scope.select.City = $scope.data[0].a_prov + $scope.data[0].a_city + $scope.data[0].a_dist;
                }
                
            }
        )
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getAddressDetail($stateParams.Id)
    });
})

//账户安全
.controller('accountSecurityController', function ($scope, $rootScope, HttpFact, PopupFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.prove = [];
    function getUser() {
        HttpFact.user.GET(domain + "/api/User/getUserInfo").then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        PopupFact.alert("提示", "数据加载有误，请重新刷新", "location.href")
                        break;
                    case 1:
                        $scope.prove = data.res_Msg[0];
                        break;
                }

            },
            function (data) {
                $scope.prove = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getUser();
    });
})
//修改密码
.controller('changePasswordController', function ($scope, $rootScope, $state, HttpFact, PopupFact, loginJumpFact) {
    loginJumpFact.tokenJudge(location.href);
    $scope.input = {
        Old_Pwd: '',
        New_Pwd: ''
    }
    $scope.again = {}
    $scope.ajaxForm = function () {
        if ($scope.input.Old_Pwd == '' || $scope.input.Old_Pwd == null) {
            PopupFact.alert("旧密码不能为空");
            return;
        }
        if ($scope.input.New_Pwd == '' || $scope.input.New_Pwd == null) {
            PopupFact.alert("新密码不能为空");
            return;
        }
        if ($scope.input.New_Pwd != $scope.again.New_Pwd) {
            PopupFact.alert("输入的新密码不一致，请重新输入");
            return;
        }
        HttpFact.user.POST(domain + "/api/User/update_Password", $scope.input).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        PopupFact.alert("提示", "提交数据失败，请再次提交", "location.href = location.href")
                        break;
                    case 1:
                        PopupFact.alert("提示", "修改密码成功", '$state.go("accountSetting")');
                        break;
                }
            },
            function (data) {
                $scope.prove = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
})
//会员中心--进销存
.controller('psdSystemController', function ($scope, $rootScope, $ionicPopup, $timeout, $ionicScrollDelegate, $ionicHistory, LoadingFact, $ionicSlideBoxDelegate, PopupFact, ModalFact, loginJumpFact, HttpFact) {
    loginJumpFact.tokenJudge(location.href);
    //每次进入视图都执行
    $scope.$on("$ionicView.beforeEnter", function () {
        $ionicHistory.clearHistory();
        $ionicScrollDelegate.$getByHandle('switchHandle').resize();
        $ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    });
    $scope.input = {}
    var pages = [{ page: 1 }, { page: 1 }, { page: 1 }, { page: 1 }];
    var size = 4;
    var purchase = []; //采购管理
    $scope.purchase = [];
    var stocks = []; //库存管理
    $scope.stocks = [];
    var market = []; //销售管理
    $scope.market = [];
    var profit = []; //盈利
    var pro_details = [];
    $scope.pro_details = [];   //详情
    $scope.profit = [];
    $scope.noData_0 = true;
    $scope.noData_1 = true;
    $scope.noData_2 = true;
    $scope.noData_3 = true;
    //采购管理
    function getPurchase(page, size) {
        var submit = {
            current: page,
            count: size
        }
        HttpFact.user.POST(domain + "/api/User/get_procurement_productsList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.purchase = purchase;
                        $scope.noData_0 = false;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        pass = JSON.parse(data.res_Msg);
                        purchase = purchase.concat(pass[0].list)
                        $scope.purchase = purchase;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope.noData_0 = false;
                            }
                            else {
                                $scope.noData_0 = true;
                            }
                        })
                        break;
                }
            },
            function (data) {
                $scope.purchase = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    //库存管理
    function getStock(page, size) {
        var submit = {
            current: page,
            count: size
        }
        HttpFact.user.POST(domain + "/api/User/get_stock_manage", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.stocks = stocks;
                        $scope.noData_1 = false;

                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                        }, 500);
                        break;
                    case 1:
                        pass = JSON.parse(data.res_Msg);
                        stocks = stocks.concat(pass[0].list)
                        $scope.stocks = stocks;
                        console.log(stocks)
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope.noData_1 = false;
                            }
                            else {
                                $scope.noData_1 = true;
                            }
                        })
                        break;
                }
            },
            function (data) {
                $scope.stocks = [];
            }
        )
    }
    //采购/库存商品的详情内容
    function getProDetail() {
        LoadingFact.show();
        HttpFact.user.POST(domain + "/api/User/get_procurement_products_Detail", $scope.input).then(
            function (data) {
                LoadingFact.hide();
                console.log(data);
                switch (data.res_Code) {
                    case 0:
                        ModalFact.clear();
                        break;
                    case 1:
                        $scope.pro_details = data.res_Msg[0];
                }
            },
            function (data) {
                $scope.pro_details = [];
            }
        )
    }
    //顶部订单按钮
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;
            $ionicScrollDelegate.$getByHandle('small').scrollTop(500);
            pages[0].page = 1;
            pages[1].page = 1;
            purchase = []; //采购管理
            $scope.purchase = [];
            stocks = []; //库存管理
            $scope.stocks = [];
            market = []; //销售管理
            $scope.market = [];
            profit = []; //盈利
            $scope.profit = [];
            $scope.noData_0 = true;
            $scope.noData_1 = true;
            $scope.noData_2 = true;
            $scope.noData_3 = true;
            switch (index) {
                case 0:
                    getPurchase(pages[0].page, size)
                    break;
                case 1:
                    getStock(pages[1].page, size);
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    };

    //打开
    $scope.openpsdSystemBox = function (id) {
        ModalFact.show($scope, "/templates/model/psdSystemBox.html");
        $scope.input.Id = id;
        getProDetail();
        console.log(id)
    }
    //关闭
    $scope.closepsdSystemBox = function () {
        ModalFact.clear();
    }

    //进销存--销售管理
    $scope.openpsdSystemSales = function () {
        ModalFact.show($scope, "/templates/model/psdSystemSales.html");
    }
    $scope.closepsdSystemSales = function () {
        ModalFact.clear();
    }
    $scope.isDisabled = false;
    $scope.tsEvent = function () {
        $scope.ts = !$scope.ts;
        $scope.isDisabled = 'true';
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getPurchase(pages[0].page, size);
    });

    //加载更多数据
    $scope.loadMore = function (value) {
        switch (value) {
            case 0:
                pages[0].page++;
                getPurchase(pages[0].page, size);
                break;
            case 1:
                pages[1].page++;
                getStock(pages[1].page, size)
                break;
            case 2:
                break;
            case 3:
                break;
        }
        getProDetail();
    }

})

//投诉
.controller('ComplaintsController', function ($scope, PopupFact, $ionicActionSheet) {

    //设置操作表-类型
    $scope.typeSet = function () {
        var txt = '';
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "网站" },
                { text: "商家" },
                { text: "建议" },
                { text: "咨询" },
            ],
            buttonClicked: function (index, value) {
                txt = value.text;
                $scope.NameTxt = txt;
                console.log(txt);
                return true;
            }
        });
    }


    $scope.input = {
        ComplaintsBox: ''
    }

    $scope.submit = function () {
        if ($scope.input.ComplaintsBox == "" || $scope.input.ComplaintsBox == null) {
            PopupFact.alert("提示", "输入框不能为空");
            return false;
        };
    }

})

//立即评价
.controller('reviewsController', function ($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, $stateParams, $state, loginJumpFact, HttpFact, PopupFact) {
    loginJumpFact.tokenJudge("reviews");
    $scope.input = {
        orderParamId: '',
        productId: '',
        paramId: '',
        c_content: '',
        c_level: ''
    }
    $scope.orders = {};
    //星级评分
    $scope.check_action = function (value) {
        $scope.input.c_level = value;
    }

    //获取订单数据
    function getOrders() {
        HttpFact.user.POST(domain + "/api/Order/get_Products_Commnet", { orderParamId: Number($stateParams.id) }).then(
            function (data) {
                $scope.orders = data.res_Msg[0];
                $scope.input.orderParamId = Number(data.res_Msg[0]._id);
                $scope.input.productId = Number(data.res_Msg[0].oductsId);
                $scope.input.paramId = Number(data.res_Msg[0].ramId);
            },
            function (data) {
                $scope.orders = {};
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }

    $scope.submit_acition = function () {
        HttpFact.user.POST(domain + "/api/Order/Add_Product_comment", $scope.input).then(
            function (data) {
                console.log(data)
                switch (data.res_Code) {
                    case -1:
                        PopupFact.alert("提示", "评价失败");
                        break;
                    case 1:
                        PopupFact.alert("提示", "评价成功", "$state.go('judge')");
                        break;
                    case 0:
                        PopupFact.alert("提示", "你已经评价过该商品了");
                        break;
                    default:
                        break;
                }
            }
        )
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getOrders()
    })
})

//退货操作
.controller('backGoodsController', function ($scope, $rootScope, loginJumpFact) {
    loginJumpFact.tokenJudge("backGoods");
    $scope.input = {}
    $scope.proDatas = [{
        name: "深圳罗技电子科技有限公司",
        products: [{
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
        }]
    }]

    //是否全选
    $scope.check_all = function () {
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

///收藏夹
.controller('favoriteController', function ($scope, $rootScope, $state, $ionicPopover, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicHistory, loginJumpFact, HttpFact, PopupFact) {

    //每次进入视图都执行
    $scope.$on("$ionicView.beforeEnter", function () {
        $ionicHistory.clearHistory();
        $ionicScrollDelegate.$getByHandle('switchHandle').resize();
        $ionicSlideBoxDelegate.enableSlide(false);
        $ionicScrollDelegate.resize();
        $scope.$broadcast("scroll.infiniteScrollComplete");
    });

    loginJumpFact.tokenJudge(location.href);

    $scope.input = {};
    var page = 1;
    var _page = 1;
    var size = 10;
    $scope.noData = true;
    $scope._noData = true;
    $ionicPopover.fromTemplateUrl("/templates/model/confirm.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })
    //打开是否确定
    $scope.proId = [];
    $scope.paraId = [];
    $scope.isConfirm = function (obj) {
        $scope.popover.show();
        //$scope.proId = id;
        console.log(obj)
        $scope.proId = Number(obj.productId);
        $scope.paraId = Number(obj.paramId);
        console.log(obj)
    }
    $scope.closeConfirm = function () {
        $scope.popover.hide();
    };

    //确认取消收藏
    $scope.confirm = function () {
        $scope.popover.hide();
        if ($scope.proId != 0) {
            HttpFact.user.POST(domain + "/api/User/Add_Collect_Product", { productId: $scope.proId, paramId: $scope.paraId }).then(
                function (data) {
                    switch (data.res_Code) {
                        case 0:
                            PopupFact.alert('提示', "取消收藏失败");
                            break;
                        case 2:
                            for (var i = 0; i < $scope.collects.length; i++) {
                                if ($scope.proId == $scope.collects[i].productId) {
                                    PopupFact.alert('提示', "取消收藏成功")
                                    $scope.collects.splice(i, 1);
                                }
                            };
                            for (var i = 0; i < $scope.favorites.length; i++) {
                                if ($scope.proId == $scope.favorites[i].productId) {
                                    PopupFact.alert('提示', "取消收藏成功")
                                    $scope.favorites.splice(i, 1);
                                }
                            };
                            break;
                    }

                },
                function (data) {
                }
            )
        };

    }
    //切换
    $scope.input.change = 0;
    $scope.switch_active = function (value) {
        $scope.input.change = value;
    }
    //编辑
    $scope.edit_active = function () {
        $scope.isCancel = !$scope.isCancel;
    }

    //获取收藏的货品
    var collects = [];
    $scope.collects = [];
    $scope.pro = []
    function getCollects(_page, size) {
        var submit = {
            current: _page,
            count: size,
            Type: 0
        }
        HttpFact.user.POST(domain + "/api/User/get_CollectList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.collects = collects;
                        $scope.noData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case -1:
                        $scope.collects = collects;
                        $scope.noData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        pass = JSON.parse(data.res_Msg);
                        collects = collects.concat(pass[0].list)
                        $scope.collects = collects;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope.noData = false;
                            }
                            else {
                                $scope.noData = true;
                            }
                        }, 500);
                        console.log(collects);
                        break;
                }
            },
            function (data) {
                $scope.collects = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
    //获取收藏的品牌
    var favorites = [];
    $scope.favorites = [];

    function getCollectsBrand(_page, size) {
        var submit = {
            current: _page,
            count: size,
            Type: 1
        }
        HttpFact.user.POST(domain + "/api/User/get_CollectList", submit).then(
            function (data) {
                switch (data.res_Code) {
                    case 0:
                        $scope.favorites = favorites;
                        $scope._noData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case -1:
                        $scope.favorites = favorites;
                        $scope._noData = false;
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        break;
                    case 1:
                        pass = JSON.parse(data.res_Msg);
                        favorites = favorites.concat(pass[0].list)
                        $scope.favorites = favorites;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            if (pass[0].list.length < size) {
                                $scope._noData = false;
                            }
                            else {
                                $scope._noData = true;
                            }
                        }, 500);
                        break;
                }
            },
            function (data) {
                $scope.favorites = [];
                $rootScope.requestJudge(data.err_code, 'PopupFact.alert("提示", "身份登录过期,请重新登录哦", "location.href = location.href")');
            }
        )
    }
    ////视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getCollects(page, size);
        getCollectsBrand(_page, size);
    });

    //加载数据事件
    $scope.loadMore = function (status) {
        switch (status) {
            case 0:
                page++;
                getCollects(page, size);
                break;
            case 1:
                _page++;
                getCollectsBrand(_page, size);
        }
    }

})

//登录
.controller('loginController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact, privilegeFact, getQueryStringFact, LoadingFact) {
    //基础设置
    $scope.input = {
        account: 'driberhan',
        pwd: '123',
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
        LoadingFact.show();
        HttpFact.post(domain + "/api/User/login", $scope.input).then(
            function (data) {
                LoadingFact.hide();
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
                        //console.log(localStorage.getItem("User-Token"))
                        $scope.url = getQueryStringFact.get('url')
                        if ($scope.url == '' || $scope.url == null) {
                            $state.go("tabs.home");
                        } else {
                            location.href = $scope.url;
                        }
                        break;
                };

            },
            function (data) {
                LoadingFact.hide();
                PopupFact.alert("提示", "登录失败，请重新登录");
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
        codeEValue: '',
        s_phone: '',
        s_idCard: '',
        s_provId: '',
        s_storeName: '',
        s_storeProv: '',
        s_storeCity: '',
        s_storeDist: '',
        s_storeDetailAddr: '',
        s_identity: '',
    };
    $scope.select = {};
    //获取省份的参数
    var id = 0; 
    var addrType = 1;
    //保存省份
    $scope.provinceData = '';
    //保存城市
    $scope.citys = '';
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
                } else {
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
    //$scope.cityList = $scope.provinceData;
    //$scope.provinces = $scope.cityList;
    $scope.citys = "";
    $scope.areas = "";
    if ($scope.select.City == "" || $scope.select.City == null) {
        $scope.select.City = "请输入所在地区";
    }

    //（未完成地址选取）关闭地址模态框
    $scope.closeCityModal = function () {
        $scope.address = "";
        $scope.provinces = '';
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
    };

    //（已完成地址选取）关闭地址模态框
    $scope.cityOkModal = function () {
        //$scope.provinces = cityList;
        $scope.citys = "";
        $scope.areas = "";
        id = 0;
        addrType = 1;
        ModalFact.clear();
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(0);
    }
    //省份事件
    $scope.provinceEvent = function (key, value, name) {
        $scope.input.s_storeProv = Number(value);
        addrType = Number(key);
        id = Number(value)
        $scope.getCity();
        $scope.address += name;
        //$scope.input.s_storeProv = val;
        //$scope.input.s_provId = val
        //for (var i = 0; i < $scope.cityList.length; i++) {
        //    if ($scope.cityList[i].p == val) {
        //        $scope.address += name;
        //        $scope.citys = $scope.cityList[i].c;
        //        break;
        //    };
        //};
        $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(1);
    };

    //城市事件
    $scope.cityEvent = function (key, value, name) {
        $scope.input.s_storeCity = Number(value);
        addrType = Number(key);
        id = Number(value)
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                areas = JSON.parse(data);
                console.log($scope.areas);

                for (var i = 0; i < $scope.citys.length; i++) {
                    if ($scope.citys[i].name == name) {
                        if ($scope.areas == '' || $scope.areas == null) {
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.select.City = "";
                            $scope.select.City = $scope.address;
                            $scope.address = "";
                            $scope.cityOkModal();
                        } else {
                            $scope.getArea();
                            if ($scope.address == name) {
                                $scope.address = name;
                            } else {
                                $scope.address += name;
                            }
                            $scope.areas = $scope.citys[i].name;
                            $ionicSlideBoxDelegate.$getByHandle("addressHandle").slide(2);
                        };
                        break;
                    }
                };
            },
            function (data) {

            }
         )
    };

    //区（县）事件
    $scope.areaEvent = function (value,name) {
        $scope.input.s_storeDist = Number(value);
        $scope.address += name;
        $scope.select.City = "";
        $scope.select.City = $scope.address;
        $scope.address = "";
        $scope.cityOkModal();
    };
    //打开地址选择框
    $scope.address_active = function () {
        ModalFact.show($scope, "/templates/model/address.html");
        $ionicScrollDelegate.$getByHandle('addressHandle').resize();
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
            $ionicScrollDelegate.resize();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, 1000);
        $scope.getProvince();
    }
    //获取省份
    $scope.getProvince = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.provinces = JSON.parse(data);
                //console.log($scope.provinces)
            }
         )
    }
    //获取城市
    $scope.getCity = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.citys = JSON.parse(data);
                console.log($scope.citys)
            }
         )
    }
    //获取区县
    $scope.getArea = function () {
        HttpFact.get(domain + "/api/Common/getAddressList?addrType=" + addrType + "&id=" + id).then(
            function (data) {
                $scope.areas = JSON.parse(data);
                areas = JSON.parse(data);
                console.log($scope.areas)
            }
         )
    }
    //身份选择
    $scope.identities = [{
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
    }]

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
        };
        if ($scope.input.codeEValue == "" || $scope.input.codeEValue == null) {
            PopupFact.alert("提示", "验证码不能为空");
            return false;
        };
        if (judgeFact.mob($scope.input.s_phone) == false) {
            return false;
        };

        if ($scope.input.s_idCard == "" || $scope.input.s_idCard == null) {
            PopupFact.alert("提示", "请输入身份证号码");
            return;
        }
        if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test($scope.input.s_idCard) == false) {

            PopupFact.alert("提示", "身份证格式不正确，请重新填写");
            return;
        }

        //if (judgeFact.checkIdCard($scope.input.s_idCard) == "") {
        //    return false;
        //};
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

                } else {
                    PopupFact.alert("提示", "注册失败", "$state.go('signup')");
                }
            }
        )

    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        //check_account();
    });

})

//找回密码
.controller('forgotController', function ($scope, HttpFact, PopupFact) {
    $scope.input = {}
    //获取验证码
    $scope.countdown = {
        // count: "5",
        message: "获取验证码",
    }
    //获取验证码
    $scope.countdown.callback = function (EmailNum) {
        HttpFact.get(domain + "/api/verify/getEmailCodeId?EmailNum=" + $scope.input.email).then(
            function (data) {
                if (data == '-1') {
                    PopupFact.alert("提示", "邮箱格式有误");
                } else {
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
})
