angular.module('controllers', [])

//首页
.controller('homeController', function ($scope) {

})

//产品
.controller('productListController', function () {
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
})
.controller('productDetailsController', function ($scope, $ionicPopover) {
    //商品信息购买界面
    $scope.popoverPro;
    $ionicPopover.fromTemplateUrl("ez-popover.html", {
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

