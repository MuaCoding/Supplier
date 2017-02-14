var domain = "http://192.168.1.22:86";
//var domain = "http://api.pf.uprice.cn";
//192.168.1.113:86

angular.module('myApp', ['ionic', 'DS.controllers', 'DS.services', 'DS.directive', 'DS.filters'])
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

    //个人中心
    .state('tabs.user', {
        url: "/user",
        views: {
            'user-tab': {
                templateUrl: "/templates/user/user.html",
                controller: 'userController'
            }
        }
    })

    //***************************************************独立层级*****************************************************
     /************************* 4.我的进货单************************************/
     // 4.1我的订货单首页
    .state('orders', {
        url: "/orders",
        templateUrl: "/templates/orders/orders.html",
        controller: 'ordersController'
    })
    //会员中心--我的进货单
   .state('order', {
       url: "/order",
       templateUrl: "/templates/orders/order.html",
       controller: 'orderController'
   })
    // 4.2填写订单信息
    .state('ordersInfo', {
        url: "/ordersInfo/{id:[0-9]*}",
        templateUrl: "/templates/orders/ordersInfo.html",
        controller: 'ordersInfoController'
    })
    // 4.3选择收货方式
    .state('pickup', {
        url: "/pickup/{id:[0-9]*}",
        templateUrl: "/templates/orders/pickup.html",
        controller: 'pickupController'
    })
    //4.4发票
    .state('invoice', {
        url: "/invoice/{id:[0-9]*}",
        templateUrl: "/templates/orders/invoice.html",
        controller: 'invoiceController'
    })

    //4.5购买详情
    .state('ordersDetail', {
        url: "/ordersDetail/{id:[0-9]*}",
        templateUrl: "/templates/orders/ordersDetail.html",
        controller: 'ordersDetailController'
    })
    //4.6备注信息
    .state('remarks', {
        url: "/remarks/{id:[0-9]*}",
        templateUrl: "/templates/orders/remarks.html",
        controller: 'remarksController'
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
         url: "/categoryList/{typeId:[0-9]*}/{brandId:[0-9]*}",
         templateUrl: "/templates/category/categoryList.html",
         controller: 'categoryListController'
     })


    /*-------------------------------------- 产品 --------------------------------------*/
    //产品列表
    .state('productList', {
        url: "/productList",
        //views: {
        //    'sort-tab': {
        templateUrl: "/templates/product/productList.html",
        controller: 'productListController'
        //    }
        //},
    })
    //产品详情
    .state('productDetails', {
        url: "/productDetails/{Id:[0-9]*}",
        templateUrl: "/templates/product/productDetails.html",
        controller: 'productDetailsController'
    })

    /*-------------------------------------- 会员 --------------------------------------*/
    //账户设置
    .state('accountSetting', {
        url: "/accountSetting",
        templateUrl: "/templates/user/accountSetting.html",
        controller: 'accountSettingController'

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
        templateUrl: "/templates/user/comment.html",
        controller: 'commentController'
    })
    //评价详情
    .state('commentDetail', {
        url: "/commentDetail/{Id:[0-9]*}",
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
        templateUrl: "/templates/user/accountSecurity.html",
        controller: 'accountSecurityController'

    })
    //修改密码
    .state('changePassword', {
        url: "/changePassword",
        templateUrl: "/templates/user/changePassword.html",
        controller: 'changePasswordController'
    })

    //账户设置 -- 收货地址管理
    .state('addressManage', {
        url: "/addressManage",
        templateUrl: "/templates/user/addressManage.html",
        controller: 'addressManageController'
    })
    //订单 -- 收货地址管理
    .state('addressSupervise', {
        url: "/addressSupervise",
        templateUrl: "/templates/user/addressSupervise.html",
        controller: 'addressSuperviseController'
    })
    //账户设置 -- 添加新地址
    .state('newAddress', {
        url: "/newAddress",
        templateUrl: "/templates/user/newAddress.html",
        controller: 'newAddressController'
    })


    //账户设置 -- 修改地址
    .state('changeAddress', {
        url: "/changeAddress/{Id:[0-9]*}",
        templateUrl: "/templates/user/changeAddress.html",
        controller: 'changeAddressController'
    })

    //手机绑定
    .state('phoneBinding', {
        url: "/phoneBinding",
        templateUrl: "/templates/user/phoneBinding.html",
        controller: 'phoneBindingController'
    })

     //邮箱绑定
    .state('emailBinding', {
        url: "/emailBinding",
        templateUrl: "/templates/user/emailBinding.html",
        controller: 'emailBindingController'
    })

    //登录
    .state('login', {
        url: "/login",
        templateUrl: "/templates/user/login.html",
        controller: 'loginController'
    })
    //注册
    .state('signup', {
        url: "/signup",
        templateUrl: "/templates/user/signup.html",
        controller: 'signupController'
    })
    //忘记密码
    .state('forgot', {
        url: "/forgot",
        templateUrl: "/templates/user/forgot.html",
        controller: 'forgotController'
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
        url: "/reviews/{id:[0-9]*}",
        templateUrl: "/templates/user/reviews.html",
        controller: 'reviewsController'
    })

     //全部货单
    .state('allOrders', {
        url: "/allOrders/{type:[0-9]*}",
        templateUrl: "/templates/user/allOrders.html",
        controller: 'allOrdersController'
    })

    //待付款
    .state('pendingPayment', {
        url: "/pendingPayment",
        templateUrl: "/templates/user/pendingPayment.html",
        controller: 'pendingPaymentController'
    })

    //待发货
    .state('shipped', {
        url: "/shipped",
        templateUrl: "/templates/user/shipped.html",
        controller: 'shippedController'
    })

     //待收货
    .state('waitReceipt', {
        url: "/waitReceipt",
        templateUrl: "/templates/user/waitReceipt.html",
        controller: 'waitReceiptController'
    })

    //待评价
    .state('Evaluation', {
        url: "/Evaluation",
        templateUrl: "/templates/user/Evaluation.html",
        //controller: 'waitEvaluationtController'
    })

     //去评价--列表
    .state('stayGrade', {
        url: "/stayGrade/{Id:[0-9]*}",
        templateUrl: "/templates/user/stayGrade.html",
        controller: 'stayGradeController'
    })
     //去评价--列表
    .state('judge', {
        url: "/judge/{id:[0-9]*}",
        templateUrl: "/templates/user/judge.html",
        controller: 'judgeController'
    })
    //提交评价 
    .state('opinion', {
        url: "/opinion/{Id:[0-9]*}",
        templateUrl: "/templates/user/opinion.html",
        controller: 'opinionController'
    })

     //进销存系统
    .state('psdSystem', {
        url: "/psdSystem",
        templateUrl: "/templates/user/psdSystem.html",
        controller: 'psdSystemController'
    })

    //投诉
    .state('Complaints', {
        url: "/Complaints",
        templateUrl: "/templates/user/Complaints.html",
        controller: 'ComplaintsController'
    })

    //实名认证
    .state('nameCertification', {
        url: "/nameCertification",
        templateUrl: "/templates/user/nameCertification.html",
        controller: 'nameCertificationController'
    })
})


    //返回
.run(function ($rootScope, $state, $location, $timeout, $ionicHistory, HttpFact, PopupFact) {
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

    //错误请求判断
    $rootScope.requestJudge = function (code, event) {
        switch (code) {
            case 10001:
                localStorage.removeItem("User-Token");
                PopupFact.alert("提示", "用户信息丢失，请重新登录！", 'location.reload();');
                break;
            case 10002:
                localStorage.removeItem("User-Token");
                PopupFact.alert("提示", "您已注销登录，请重新登录！", 'location.reload();');
                break;
            case 10003:
                localStorage.removeItem("User-Token");
                PopupFact.alert("提示", "账号在其他设备登录，请重新登录！", 'location.reload();');
                break;
            case 10004:
                PopupFact.alert("提示", "您的权限不足！");
                break;
            default:
                eval(event);
                break;
        };
    };

})