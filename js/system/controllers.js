angular.module('controllers',[])

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
            if ($(this).find(".on").hasClass("active")==false) {
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

.controller('sortHomeController', function () {

})
//我的进货单
.controller('ordersHomeController', function($scope,$ionicPopup){
    $scope.input = {}
	$scope.cartData = 
		[
            {
                name: "品牌商：深圳罗技电子科技有限公司1",
                goods: [{
                        id: 1,
                        tradeName: "Beats Solo1 无线头戴式耳机11",
                        amount: "￥"+198.00,
                        color: "黑色",
                        edition: "普通版"
                    },{
                        id: 2,
                        tradeName: "Beats Solo8 无线头戴式耳机22",
                        amount: "￥"+198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]   
            },{
                name: "品牌商：深圳罗技电子科技有限公司2",
                goods: [{
                        id: 3,
                        tradeName: "Beats Solo1 无线头戴式耳机33",
                        amount: "￥"+198.00,
                        color: "黑色",
                        edition: "普通版"
                    },{
                        id: 4,
                        tradeName: "Beats Solo8 无线头戴式耳机44",
                        amount: "￥"+198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]  
            }
        ]   
	
   
	$scope.edit =function(){
        showDelte =false;
	}

    $scope.moveItem = function(good, fromIndex, toIndex) {
        $scope.goods.splice(fromIndex, 1);
        $scope.goods.splice(toIndex, 0, good);
    };

    $scope.delete =function(good){
         $scope.goods.splice($scope.id.indexOf(good.id), 1);
    }

    $scope.popup = function(){

       $scope.data = {}
       // var confirmPopup = $ionicPopup.confirm({
       //  template: '确认要删除这1种商品吗？'
       // })；

       confirmPopup.then(function(res){
            if(res){
                console.log('确定');
            }
            else{
                console.log("取消")
            }
       })
    }

})

