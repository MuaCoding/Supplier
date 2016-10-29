angular.module('controllers', [])

//首页
.controller('homeController', function ($scope) {

})

//产品
.controller('productListController', function ($scope,ModalFact) {
    $(".Products > a > .Img").css({ "height": ($("body").width() - $(".Products > a > .Img").width()) * 0.6 })

    $(".filter > a").each(function () {
        $(this).children("div").css({ "right": ($(this).width() - $(this).children("span").width()) / 4 });
    });
    $(".filter").on("click", "a", function () {
        if ($(this).hasClass("active") == true) {
            $(this).find(".on")
            if ($(this).find(".on").hasClass("active") == false) {
                $(this).addClass("active").siblings("i").removeClass("active");
            }
        }
        else {
            $(this).find(".xia").addClass("active").siblings("i").removeClass("active");
        }
        if ($(this).hasClass("active") == false) {
            $(this).addClass("active").siblings("a").removeClass("active");

        };
    });
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
.controller('productDetailsController', function ($scope, $ionicPopover) {
    $scope.AllModel = {
        ColorModel: [
            {
                Id: null,
                TypeName: "红色",
                Check: false
            },
            {
                Id: null,
                TypeName: "白色",
                Check: false
            },
            {
                Id: null,
                TypeName: "黑色",
                Check: false
            },
        ],
        VersionModel: [
           {
               Id: null,
               TypeName: "普通版",
               Check: false
           },
           {
               Id: null,
               TypeName: "尊贵版",
               Check: false
           },
           {
               Id: null,
               TypeName: "旗舰版",
               Check: false
           },
           {
               Id: null,
               TypeName: "限量版",
               Check: false
           },
        ],
        PriceModel: [
           {
               Id: null,
               TypeName: "1~99件",
               TypePrice: "￥230.00",
               Check: false
           },
           {
               Id: null,
               TypeName: "≥100件",
               TypePrice: "￥230.00",
               Check: false
           },
           {
               Id: null,
               TypeName: "≥999件",
               TypePrice: "￥230.00",
               Check: false
           },
        ],
    };

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

})

.controller('sortHomeController', function ($scope) {
    //获取数据
    $scope.proList = {
        Size: 1,
        Page: 7,
        classList: [
            {
                Class: "移动电源",
                List: [
                    {
                        Pic: "/images/sort/HomeImg.png",
                        brandName: "苹果/Apple Store"
                    },
                    {
                        Pic: "/images/sort/HomeImg1.png",
                        brandName: "三星电子"
                    },
                    {
                        Pic: "/images/sort/HomeImg2.png",
                        brandName: "索尼"
                    },
                ]
            },
            {
                Class: "数码配件",
                List: [
                    {
                        Pic: "/images/sort/HomeImg1.png",
                        brandName: "三星电子"
                    },
                    {
                        Pic: "/images/sort/HomeImg2.png",
                        brandName: "索尼"
                    },
                    {
                        Pic: "/images/sort/HomeImg.png",
                        brandName: "苹果/Apple Store"
                    },
                    {
                        Pic: "/images/sort/HomeImg1.png",
                        brandName: "三星电子"
                    }
                ]
            },{
                Class: "其他配件",
                List: [
                    {
                        Pic: "/images/sort/HomeImg1.png",
                        brandName: "三星电子"
                    },
                    {
                        Pic: "/images/sort/HomeImg2.png",
                        brandName: "索尼"
                    },
                    {
                        Pic: "/images/sort/HomeImg.png",
                        brandName: "苹果/Apple Store"
                    },
                    {
                        Pic: "/images/sort/HomeImg1.png",
                        brandName: "三星电子"
                    },
                    {
                        Pic: "/images/sort/HomeImg1.png",
                        brandName: "三星电子"
                    }
                ]
            }
        ]
    };

    $scope.proEvent = {
        proIndex: 0,
        set: function (index) {
            $scope.proEvent.proIndex = index;
        },
        get: function (index) {
            return $scope.proEvent.proIndex == index;
        }
    }
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


    $scope.flag={showDelete:false};



    $scope.delete = function (index1, index2) {
        if ($scope.cartData[index1].goods.length <= 1) {
            $scope.cartData.splice(index1, 1);
        }
        else {
            $scope.cartData[index1].goods.splice(index2, 1);
        };
    };
})


//订单详情
.controller('ordersDetailController', function($scope,$state,$ionicPopover){
    

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

    $scope.proReplace=function(){
        $scope.popover.remove();
        $state.go("replaceGoods");
    }

    $scope.exchange = function(){
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
.controller('returnsDetailController', function($scope){
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


    $scope.flag={showDelete:false};



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

    
    $scope.input={gender:"先生"};
    $scope.single_check = function(name, value) {
       
        $scope.input[name] = value;
    }
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

.controller('reviewsController', function($scope){
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
    $scope.is_agree = function() {
        $scope.agree = !$scope.agree;
    };
})

//退货操作
.controller('backGoodsController', function($scope){
    $scope.proData = [
        {
            name: "深圳罗技电子科技有限公司",
            goods: [
                {
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机",
                    amount: "￥" + 1980.00,
                    color: "黑色",
                    edition: "普通版",
                    number: 5
                },{
                    id: 2,
                    tradeName: "Apple 数据闪充数据线",
                    amount: "￥" + 1980.00,
                    color: "黑色",
                    edition: "普通版"
                }
            ]
        },
    ]
})


//favoriteController收藏确认
.controller('favoriteController', function($scope,$state,$ionicPopover){
    $ionicPopover.fromTemplateUrl("/templates/model/confirm.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $scope.confirm = function () {
        $scope.popover.show();
    }
    $scope.closeConfirm = function () {
        $scope.popover.remove();
    };

})

