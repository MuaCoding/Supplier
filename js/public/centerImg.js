
//图片自适应 v3.0
//_centerImg图片父级
function centerImg(_centerImg) {
    eachCIJS(_centerImg);

    $(window).resize(function () {
        eachCIJS(_centerImg);
    });
};

function eachCIJS(_centerImg) {
    _centerImg.each(function () {
        var $this = $(this);
        var $thisImg = $this.children("img");

        /*----------------------------非动态载入的图片加载完成后执行-----------------------------*/
        var $imgDom = $(this).children("img").get(0);
        if ($imgDom.complete) {
            CI($this, $thisImg);
        } else {
            $thisImg.load(function () {
                CI($this, $thisImg);
            });
        };
    });
}

function CI($this, $thisImg) {
    $thisImg.css({ "max-width": "none", "max-height": "none", "min-width": "none", "min-width": "none" });
    if ($thisImg.width() >= $this.width() || $thisImg.height() >= $this.height()) {
        $thisImg.css({ "max-width": "100%", "max-height": "100%" });
    }
    else {
        $thisImg.css({ "min-width": "100%", "min-height": "100%" });
    }

    $thisImg.css({ "width": "auto", "height": "auto", "margin-top": "0px", "margin-left": "0px" });

    var _width = $this.width() - $thisImg.width();
    var _height = $this.height() - $thisImg.height();

    var _WH = $thisImg.width() / $thisImg.height();

    if ($thisImg.width() >= $this.width() || $thisImg.height() >= $this.height()) {
        if (_width < _height) {
            $thisImg.css({ "width": $this.height() * _WH, "height": $this.height(), "max-width": "none", "max-height": "none", "margin-left": -(($this.height() * _WH) - $this.width()) / 2 });
        }
        else if (_width >= _height) {
            $thisImg.css({ "width": $this.width(), "height": $this.width() / _WH, "max-width": "none", "max-height": "none", "margin-top": -(($this.width() / _WH) - $this.height()) / 2 });
        }
    };

    if ($thisImg.width() < $this.width() || $thisImg.height() < $this.height()) {
        if (_height == 0) {
            $thisImg.css({ "width": $this.height() * _WH, "height": $this.height(), "min-width": "none", "min-height": "none", "margin-left": -(($this.height() * _WH) - $this.width()) / 2 });
        }
        else {
            $thisImg.css({ "width": $this.width(), "height": $this.width() / _WH, "min-width": "none", "min-height": "none", "margin-top": -(($this.width() / _WH) - $this.height()) / 2 });
        }
    };
}



//_centerImg图片父级
function centerImg2(_centerImg) {
    eachCI2JS(_centerImg);

    $(window).resize(function () {
        eachCI2JS(_centerImg);
    });
};

function eachCI2JS(_centerImg) {
    _centerImg.each(function () {
        var $this = $(this);
        var $thisImg = $this.children("img");

        /*----------------------------载入的图片加载完成后执行-----------------------------*/
        var $imgDom = $(this).children("img").get(0);
        if ($imgDom.complete) {
            CI2($this, $thisImg);
        } else {
            $thisImg.load(function () {
                CI2($this, $thisImg);
            });
        };
    });
}

function CI2($this, $thisImg) {
    $thisImg.css({ "margin": "0px", "max-width": "100%", "max-height": "100%", "min-width": "none", "min-height": "none" });

    var _width = $thisImg.width();
    var _height = $thisImg.height();
    var _WH1 = $this.width() / $this.height();
    var _WH2 = $thisImg.width() / $thisImg.height();

    //min-width
    function minWSet() {
        $thisImg.css({ "min-width": "100%" });
        $thisImg.css({ "margin-top": ($this.height() - $thisImg.height()) / 2 });
    }

    //min-height
    function minHSet() {
        $thisImg.css({ "min-height": "100%" });
        $thisImg.css({ "margin-left": ($this.width() - $thisImg.width()) / 2 });
    }

    //横向长方形
    if ($this.width() > $this.height()) {
        if (_width < _height) {
            //min-height
            minHSet();
        }
        else if (_width > _height) {
            if (_WH1 > _WH2) {
                //min-height
                minHSet();
            }
            else if (_WH1 < _WH2) {
                //min-width
                minWSet();
            };
        }
        else if (_width == _height) {
            //min-height
            minHSet();
        }
    }//纵向长方形
    else if ($this.width() < $this.height()) {
        if (_width < _height) {
            if (_WH1 > _WH2) {
                //min-width
                minWSet();
            }
            else if (_WH1 < _WH2) {
                //min-height
                minHSet();
            };
        }
        else if (_width > _height) {
            //min-width
            minWSet();
        }
        else if (_width == _height) {
            //min-width
            minWSet();
        }
    }//正方形
    else if ($this.width() == $this.height()) {
        if (_width < _height) {
            //min-height
            minHSet();
        }
        else if (_width > _height) {
            //min-width
            minWSet();
        };
    }
}

function centerImg3(_centerImg) {
    eachCI3JS(_centerImg);

    $(window).resize(function () {
        eachCI3JS(_centerImg);
    });
};

function eachCI3JS(_centerImg) {
    _centerImg.each(function () {
        var $this = $(this);
        var $thisImg = $this.children("img");

        /*----------------------------非动态载入的图片加载完成后执行-----------------------------*/
        var $imgDom = $(this).children("img").get(0);
        if ($imgDom.complete) {
            CI3($this, $thisImg);
        } else {
            $thisImg.load(function () {
                CI3($this, $thisImg);
            });
        };
    });
}

function CI3($this, $thisImg) {
    $thisImg.css({ "max-width": "100%", "max-height": "100%", "margin": "0px auto" });

    var _width = $this.width() - $thisImg.width();
    var _height = $this.height() - $thisImg.height();

    if ($thisImg.height() <= $this.height()) {
        $thisImg.css({ "margin-top": _height / 2, "margin-left": _width / 2 });
    }
}
