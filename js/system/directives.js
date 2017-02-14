angular.module('DS.directive', [])

//上传图片及其他有关的操作事件
.directive('uploadImgLinkage', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $rootScope, $timeout, ModalFact, HttpFact) {
            //离开视图时执行事件
            $rootScope.$on("$ionicView.beforeLeave", function () {
                ModalFact.clear();
            })

            //初始化设置
            //图片链接设置空
            $rootScope.myCroppedImage = '';
            $rootScope.myImage = '';

            //默认选区大小为100 * 100
            $scope.rectangleWidth = 100;
            $scope.rectangleHeight = 100;

            $scope.cropper = {
                cropWidth: $scope.rectangleWidth,
                cropHeight: $scope.rectangleHeight
            };

            //默认选区中位置是否立即执行剪切，true为否，false为是
            $rootScope.blockingObject = { block: true };

            $rootScope.handleFileSelect = function (evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.openImgEdit();

                    $timeout(function () {
                        $rootScope.myImage = evt.target.result;
                    }, 20);
                };
                reader.readAsDataURL(file);
            };

            //选择图片Input
            angular.element(document.querySelector('.fileImg')).on('change', $rootScope.handleFileSelect);

            //完成图片编辑（添加给图片列表）
            $scope.completeEdit = function (imgList) {
                $rootScope.blockingObject.render();
                $timeout(function () {
                    $rootScope.myCroppedImage = document.getElementById("imgUrl").innerHTML;

                    //图片生成事件
                    HttpFact.post(domain + "/api/user/uploadPic", { base64Pic: $rootScope.myCroppedImage }).then(
                    function (data) {
                        if (data == "Failure") {
                            alert("图片上传失败！");
                        }
                        else {
                            $rootScope.myCroppedImage = data;

                            if (typeof (imgList) != "undefined") {
                                imgList.push($rootScope.myCroppedImage);
                            }

                            ModalFact.clear();
                        }
                    },
                    function (data) {
                        alert("图片上传失败！");
                    });
                });
            }

            //关闭添加图片模型事件
            $scope.closeModal = function () {
                ModalFact.clear();
            }

            //添加图片
            $scope.openImgEdit = function () {
                ModalFact.show($scope, "/templates/modal/imgEdit.html");
            }

            //删除图片
            $scope.deleteImg = function (_index, imgList) {
                imgList.splice(_index, 1);
            }
        }
    }
})


.directive('pictureImg', function ($timeout, $rootScope, $ionicPopover, $ionicSlideBoxDelegate) {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            //点击放大图
            $ionicPopover.fromTemplateUrl("/templates/model/bigPicture.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;

            })
            $scope.bigPictureList = [];
            $scope.openPopover = function (str) {
                $scope.popover.show();
                $scope.bigPictureList = [];
                var reg = new RegExp("\"", "g");
                for (var i = 0; i < str.length; i++) {
                    $scope.bigPictureList.push(str[i].toString().replace(reg, ""));
                }
                $ionicSlideBoxDelegate.update();
                if ($scope.bigPictureList.length <= 2) {
                    $ionicSlideBoxDelegate.loop(false);
                }
                else {
                    $ionicSlideBoxDelegate.loop(true);
                }

                $timeout(function () {
                    $ionicSlideBoxDelegate.slide(0);
                })
            };
            $scope.closePopover = function () {
                $scope.popover.hide();

            };
        }
    }
})

.directive('pictureImgOne', function ($timeout, $rootScope, $ionicPopover, $ionicSlideBoxDelegate) {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            //点击放大图
            $ionicPopover.fromTemplateUrl("/templates/model/bigPictureOne.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popoverOne = popover;

            })
            $scope.bigPicture = "";
            $scope.openPopoverOne = function (str) {
                $scope.popoverOne.show();
                $scope.bigPicture = "";
                var reg = new RegExp("\"", "g");
                $scope.bigPicture = str.toString().replace(reg, "")
            };
            $scope.closePopoverOne = function () {
                $scope.popoverOne.hide();

            };
        }
    }
})

//模型事件
.directive('modalLinkage', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $rootScope, ModalFact) {
            //离开视图时执行事件
            $rootScope.$on("$ionicView.beforeLeave", function () {
                ModalFact.clear();
            })
            //统一关闭模型事件（要进行其他操作时，用单独的关闭模型事件）

           

        }
    }
})

 ///获取验证码
.directive('countdown', function ($interval) {
    return {
        restrict: 'E',
        scope: {
            countdown: "=",
            disabled: "=countdownDisabled"
        },
        link: function (scope, element, attrs) {
            // function body
            var counting = false;
            $(element).bind("click", function (e) {
                if (scope.disabled || counting) {
                    return;
                }
                countdown();
            })

            function countdown() {
                var last_message = scope.countdown.message,
                    count = parseFloat(scope.countdown.count) ? parseFloat(scope.countdown.count) : 60;
                counting = true;
                scope.$apply(function () {
                    scope.countdown.message = count--;
                    scope.countdown.message = count + "s重新获取";
                    scope.countdown.mode = "disabled";
                    scope.countdown.reset = false;
                    scope.countdown.callback();
                });
                var timer = $interval(function () {
                    scope.countdown.message = count--;
                    scope.countdown.message = count + "s重新获取";
                    if (count < 0 || scope.countdown.reset) {
                        $interval.cancel(timer);
                        scope.countdown.message = last_message;
                        counting = false;
                    }
                }, 1000)
            }
        }
    };
})

//自动获取焦点事件
.directive('auto', function () {
    return {
        scope: false,
        link: function (scope, element) {
            scope.$watch("isCome", function (newValue, oldValue, scope) {
                if (newValue) {
                    element[0].focus();
                }
                console.log(newValue)
                console.log(oldValue)
            }, true);;
        }
    };
})