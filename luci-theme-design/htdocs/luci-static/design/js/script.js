(function($) {
    $(".main > .loading").fadeOut();

    function trimText(text) {
        return text.replace(/[ \t\n\r]+/g, " ");
    }

    var lastNode = undefined;
    var mainNodeName = undefined;
    var nodeUrl = "";

    (function(node) {
        if (node[0] == "admin") {
            luciLocation = [node[1], node[2]];
        } else {
            luciLocation = node;
        }
        for (var i in luciLocation) {
            nodeUrl += luciLocation[i];
            if (i != luciLocation.length - 1) {
                nodeUrl += "/";
            }
        }
    })(luciLocation);

    function getCurrentNodeByUrl() {
        if (!$('body').hasClass('logged-in')) {
            luciLocation = ["Main", "Login"];
            return true;
        }
        const urlReg = new RegExp(nodeUrl + "$");
        var ret = false;
        $(".main > .main-left > .nav > .slide > .active").next(".slide-menu").stop(true).slideUp("fast");
        $(".main > .main-left > .nav > .slide > .menu").removeClass("active");
        $(".main > .main-left > .nav > .slide > .menu").each(function() {
            var ulNode = $(this);
            ulNode.next().find("a").each(function() {
                var that = $(this);
                var href = that.attr("href");
                if (urlReg.test(href)) {
                    ulNode.click();
                    ulNode.next(".slide-menu").stop(true, true);
                    lastNode = that.parent();
                    lastNode.addClass("active");
                    ret = true;
                    return true;
                }
            });
        });
        return ret;
    }

    // 二级菜单点击（使用 jQuery slide 动画，保留）
    $(".main > .main-left > .nav > .slide > .menu").click(function() {
        var ul = $(this).next(".slide-menu");
        var menu = $(this);
        if (!menu.hasClass("exit")) {
            $(".main > .main-left > .nav > .slide > .active").next(".slide-menu").stop(true).slideUp("fast");
            $(".main > .main-left > .nav > .slide > .menu").removeClass("active");
            if (!ul.is(":visible")) {
                menu.addClass("active");
                ul.addClass("active");
                ul.stop(true).slideDown("fast");
            } else {
                ul.stop(true).slideUp("fast", function() {
                    menu.removeClass("active");
                    ul.removeClass("active");
                });
            }
            return false;
        }
    });

    $(".main > .main-left > .nav > .slide > .slide-menu > li > a").click(function() {
        if (lastNode != undefined) lastNode.removeClass("active");
        $(this).parent().addClass("active");
        $(".main > .loading").fadeIn("fast");
        return true;
    });

    $(".main > .main-left > .nav > .slide > .slide-menu > li").click(function() {
        if (lastNode != undefined) lastNode.removeClass("active");
        $(this).addClass("active");
        $(".main > .loading").fadeIn("fast");
        window.location = $($(this).find("a")[0]).attr("href");
        return false;
    });

    if (getCurrentNodeByUrl()) {
        mainNodeName = "node-" + luciLocation[0] + "-" + luciLocation[1];
        mainNodeName = mainNodeName.replace(/[ \t\n\r\/]+/g, "_").toLowerCase();
        $("body").addClass(mainNodeName);
    }

    // 设置按钮图标
    $(".cbi-button-up").val("");
    $(".cbi-button-down").val("");

    // 修复 legend 位置
    $("legend").each(function() {
        var that = $(this);
        that.after("<span class='panel-title'>" + that.text() + "</span>");
    });

    // 页面内链接点击 loading
    $("#maincontent > .container").find("a").each(function() {
        var that = $(this);
        var onclick = that.attr("onclick");
        if (onclick == undefined || onclick == "") {
            that.click(function() {
                var href = that.attr("href");
                if (href.indexOf("#") == -1) {
                    $(".main > .loading").fadeIn("fast");
                    return true;
                }
            });
        }
    });

    // 窗口大小改变时处理品牌样式（移动端菜单已在 header 中用原生 JS 控制）
    $(window).resize(function() {
        if ($(window).width() > 992) {
            $(".main-left").css("width", "");
            $(".darkMask").stop(true).css("display", "none");
            $(".showSide").css("display", "");
            $("header").css("box-shadow", "18rem 2px 4px rgba(0,0,0,0.08)");
            $("header>.container>.brand").css("padding", "0rem");
        } else {
            $("header").css("box-shadow", "0 2px 4px rgba(0,0,0,0.08)");
            $("header>.container>.brand").css("padding", "0 4.5rem");
        }
        // 如果侧边栏打开状态且宽度 > 992，强制关闭（通过类）
        if ($(window).width() > 992 && $(".main-left").hasClass("show")) {
            $(".main-left").removeClass("show");
            $(".darkMask").removeClass("show");
        }
    });

    $(".main-right").focus();
    $(".main-right").blur();
    $("input").attr("size", "0");

    if (mainNodeName != undefined) {
        switch (mainNodeName) {
            case "node-status-system_log":
            case "node-status-kernel_log":
                $("#syslog").focus(function() {
                    $("#syslog").blur();
                    $(".main-right").focus();
                    $(".main-right").blur();
                });
                break;
            case "node-status-firewall":
                var button = $(".node-status-firewall > .main fieldset li > a");
                button.addClass("cbi-button cbi-button-reset a-to-btn");
                break;
            case "node-system-reboot":
                var button = $(".node-system-reboot > .main > .main-right p > a");
                button.addClass("cbi-button cbi-input-reset a-to-btn");
                break;
        }
    }
})(jQuery);
