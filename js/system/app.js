angular.module('myApp', ['ionic', 'controllers'])
.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {
   // $locationProvider.html5Mode(true);
    $ionicConfigProvider.views.maxCache(5);                                               //视图缓存最大为5
    $ionicConfigProvider.tabs.position("bottom");                                         //tabs 位置是在顶部还是底部 参数可以是：top | bottom  
    $ionicConfigProvider.tabs.style("standard");                                           //tabs 条带风格 参数可以是： standard | striped
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');             //标题栏标题居中
    $ionicConfigProvider.scrolling.jsScrolling(true);                                       //滚动优化（滚动更平滑）
    $urlRouterProvider.otherwise("/footers/home");                                                 //设置默认进入页面
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);                                              //设置默认进入页面

    $stateProvider
     /*------------------------------------------首页路由---------------------------------------*/
    .state('footers', {
        url: '/footers',
        templateUrl: "/templates/footer/footer.html"
    })

    /**********************tab路由****************************/
    //2.首页
      .state('footers.home', {
            url: "/home",
            views: {
                'home-footer': {
                    templateUrl: "/templates/home/home.html",

                    controller: 'homeController'
                }
            }
        })

    //分类
    .state('footers.sort', {
        url: "/sort",
        views: {
            'sort-footer': {
                templateUrl: "/templates/sort/sortHome.html",
                controller: 'sortHomeController'
            }
        }
    })

    //咨讯
    .state('footers.information',{
        url: "/information",
        views: {
            'information-footer': {
                templateUrl: "/templates/information/infoHome.html"

            }
        }
    })

    //进货单
    // .state('footers.orders', {
    //     url: "/orders",
    //     views: {
    //         'orders-footer': {
    //             templateUrl: "/templates/orders/ordersHome.html"
    //         }
    //     }
    // })
    //个人中心
    .state('footers.me', {
        url: "/me",
        views: {
            'me-footer': {
                templateUrl:"/templates/me/meHome.html"
            }
        }
    })

    //***************************************************独立层级*****************************************************
     // 4.我的订货单
     // 4.1我的订货单首页
    .state('orders', {
        url: "/orders",
        templateUrl:"/templates/orders/ordersHome.html",
        controller: 'ordersHomeController'
    })
    // 4.2填写订单信息
    .state('ordersInfo', {
        url: "/ordersInfo",
        templateUrl:"/templates/orders/ordersInfo.html"
    })
    // 4.3选择收货方式
    .state('pickup', {
        url: "/pickup",
        templateUrl:"/templates/orders/pickup.html"
    })

       /*-------------------------------------- 产品 --------------------------------------*/
    .state('productList', {
        url: "/productList",
        //views: {
        //    'sort-footer': {
                templateUrl: "/templates/product/List.html",
                controller: 'productListController'
        //    }
        //},
    })
    .state('productDetails', {
        url: "/productDetails",
        templateUrl: "/templates/product/Details.html",
        //controller: 'productDetailsController'
    })

})
    //返回
.run(function ($rootScope, $location, $timeout, $ionicHistory) {
    //重制返回事件，无上一页时返回首页
    $rootScope.$ionicGoBack = function (customUrl) {
        if (!customUrl) {
            customUrl = "/footers/home";
        }
        if ($ionicHistory.backView()) {
            $ionicHistory.goBack(-1);
        }
        else {
            $timeout(function () {
                $location.path(customUrl);
            }, 1)
        }
    };
})