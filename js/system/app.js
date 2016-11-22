var domain = "http://192.168.1.112:98";

angular.module('myApp', ['ionic', 'DS.controllers','DS.services','DS.directive','imageview','showonLoad'])
.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $ionicConfigProvider.views.maxCache(5);                                               //视图缓存最大为5
    $ionicConfigProvider.tabs.position("bottom");                                         //tabs 位置是在顶部还是底部 参数可以是：top | bottom  
    $ionicConfigProvider.tabs.style("standard");                                           //tabs 条带风格 参数可以是： standard | striped
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');             //标题栏标题居中
    $ionicConfigProvider.scrolling.jsScrolling(true);                                       //滚动优化（滚动更平滑）
    $urlRouterProvider.otherwise("/tabs/home");                                                 //设置默认进入页面
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);                                              //设置默认进入页面

    $stateProvider
     /*------------------------------------------首页路由---------------------------------------*/
    .state('tabs', {
        url: '/tabs',
        templateUrl: "/templates/footer/tab.html"
    })

    /**********************tab路由****************************/
    //2.首页
      .state('tabs.home', {
          url: "/home",
          views: {
              'home-tab': {
                  templateUrl: "/templates/home/home.html",
                  controller: 'homeController'
              }
          }
      })

    //分类
    .state('tabs.category', {
        url: "/category",
        views: {
            'category-tab': {
                templateUrl: "/templates/category/category.html",
                controller: 'categoryController'
            }
        }
    })

    //咨讯
    .state('tabs.information', {
        url: "/information",
        views: {
            'information-tab': {
                templateUrl: "/templates/information/infoHome.html",
                controller: 'informationController'
            }
        }
    })

    //进货单
    // .state('tabs.orders', {
    //     url: "/orders",
    //     views: {
    //         'orders-tab': {
    //             templateUrl: "/templates/orders/ordersHome.html"
    //         }
    //     }
    // })
    //个人中心
    .state('tabs.user', {
        url: "/user",
        views: {
            'user-tab': {
                templateUrl: "/templates/user/user.html"
            }
        }
    })

    

    //***************************************************独立层级*****************************************************
     /************************* 4.我的进货单************************************/
     // 4.1我的订货单首页
    .state('orders', {
        url: "/orders",
        templateUrl: "/templates/orders/ordersHome.html",
        controller: 'ordersHomeController'
    })
    // 4.2填写订单信息
    .state('ordersInfo', {
        url: "/ordersInfo",
        templateUrl: "/templates/orders/ordersInfo.html"
    })
    // 4.3选择收货方式
    .state('pickup', {
        url: "/pickup",
        templateUrl: "/templates/orders/pickup.html",
        controller: 'pickupController'
    })
    //4.4发票
    .state('invoice', {
        url: "/invoice",
        templateUrl: "/templates/orders/invoice.html",
        controller: 'invoiceController'
    })

    //4.5订单详情
    .state('ordersDetail', {
        url: "/ordersDetail",
        templateUrl: "/templates/orders/ordersDetail.html",
        controller: 'ordersDetailController'
    })

    /****************************************咨讯************************************************/
    .state('informationDetail', {
        url: "/informationDetail/{Id:[0-9]*}",
        templateUrl: "/templates/information/informationDetail.html",
        controller: 'informationDetailController'
    })

     /****************************************分类************************************************/
     //分类 -- 品牌列表

     .state('categoryList', {
        url: "/categoryList/{typeId:[0-9]*}/{b_id:[0-9]*}",
        templateUrl: "/templates/category/categoryList.html",
        controller: 'categoryListController'
    })


    /*-------------------------------------- 产品 --------------------------------------*/

    .state('productList', {
        url: "/productList",
        //views: {
        //    'sort-tab': {
        templateUrl: "/templates/product/List.html",
        controller: 'productListController'
        //    }
        //},
    })
    .state('productDetails', {
        url: "/productDetails/{Id:[0-9]*}",
        templateUrl: "/templates/product/Details.html",
        controller: 'productDetailsController'
    })

    /*-------------------------------------- 会员 --------------------------------------*/
    //账户设置
    .state('accountSetting', {
        url: "/accountSetting",
        templateUrl: "/templates/user/accountSetting.html"

    })
    //我的消息
    .state('myNews', {
        url: "/myNews",
        templateUrl: "/templates/user/myNews.html"

    })

    //我的消息详情
    .state('myNewsDetail', {
        url: "/myNewsDetail",
        templateUrl: "/templates/user/myNewsDetail.html"

    })
    //我的评价
    .state('comment', {
        url: "/comment",
        templateUrl: "/templates/user/comment.html"

    })
    //评价详情
    .state('commentDetail', {
        url: "/commentDetail",
        templateUrl: "/templates/user/commentDetail.html",
        controller: 'commentDetailController'

    })

    //我的进货单
    .state('myOrders', {
        url: "/myOrders",
        templateUrl: "/templates/user/myOrders.html",
        controller: 'myOrdersController'

    })

    //收藏夹
    .state('favorite', {
        url: "/favorite",
        templateUrl: "/templates/user/favorite.html",
        controller: 'favoriteController'
    })

    //已买到的商品

    .state('boughtProduct', {
        url: "/boughtProduct",
        templateUrl: "/templates/user/boughtProduct.html"
    })

    //交易记录查找
    .state('recordSearch', {
        url: "/recordSearch",
        templateUrl: "/templates/user/recordSearch.html"
    })

    //退货单管理
    .state('returns', {
        url: "/returns",
        templateUrl: "/templates/user/returns.html"
    })

    //退货单详情
    .state('returnsDetail', {
        url: "/returnsDetail",
        templateUrl: "/templates/user/returnsDetail.html",
        controller: 'returnsDetailController'
    })

    //填写退货单信息
    .state('editReturnsInfo', {
        url: "/editReturnsInfo",
        templateUrl: "/templates/user/editReturnsInfo.html"
                // controller: 'editReturnsInfoController'
    })


    //基本信息
    .state('basicData', {
        url: "/basicData",
        templateUrl: "/templates/user/basicData.html",
        controller: 'basicDataController'
    })

    
    //头像设置
    .state('avatarSettings', {
        url: "/avatarSettings",
        templateUrl: "/templates/user/avatarSettings.html",
        controller: 'avatarSettingsController'
    })


    // 重置密码
    .state('resetPassword', {
        url: "/resetPassword",
        templateUrl: "/templates/user/resetPassword.html",
    })

    //账户安全设置
    .state('accountSecurity', {
        url: "/accountSecurity",
        templateUrl: "/templates/user/accountSecurity.html"
    })
    //修改密码
    .state('changePassword', {
        url: "/changePassword",
        templateUrl: "/templates/user/changePassword.html"
    })

    //账户设置 -- 收货地址管理
    .state('addressManage', {
        url: "/addressManage",
        templateUrl: "/templates/user/addressManage.html",
        controller: 'addressManageController'
    })

    //账户设置 -- 添加新地址
    .state('newAddress', {
        url: "/newAddress",
        templateUrl: "/templates/user/newAddress.html",
        controller: 'newAddressController'
    })

    //登录
    .state('login', {
        url: "/login",
        templateUrl: "/templates/user/login.html",
        controller: 'loginController'
    })
    //忘记密码
    .state('forgotPassword', {
        url: "/forgotPassword",
        templateUrl: "/templates/user/forgotPassword.html"
    })
    //确认收货
    .state('confirm', {
        url: "/confirm",
        templateUrl: "/templates/user/confirm.html"
    })
    //退货操作
    .state('backGoods', {
        url: "/backGoods",
        templateUrl: "/templates/user/backGoods.html",
        controller: 'backGoodsController'
    })

    //换货操作
    .state('replaceGoods', {
        url: "/replaceGoods",
        templateUrl: "/templates/user/replaceGoods.html"
        //controller: 'forgotPasswordController'
    })
    

    //立即评价
    .state('reviews', {
        url: "/reviews",
        templateUrl: "/templates/user/reviews.html",
        controller: 'reviewsController'
    })

})


    //返回
.run(function ($rootScope, $location, $timeout, $ionicHistory) {
    //重制返回事件，无上一页时返回首页
    $rootScope.$ionicGoBack = function (customUrl) {
        if (!customUrl) {
            customUrl = "/tabs/home";
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