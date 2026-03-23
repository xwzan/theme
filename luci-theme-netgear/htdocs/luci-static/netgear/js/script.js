/**
 *  Netgear theme for LuCI - adapted for OpenWrt 25.12
 *  Based on luci-theme-material
 *  Licensed to the public under the Apache License 2.0
 */

(function() {
    // 页面加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 隐藏 loading 动画
        var loading = document.querySelector('.main > .loading');
        if (loading) loading.style.display = 'none';

        /**
         * 去除字符串中的空白和换行
         * @param {string} text
         * @returns {string}
         */
        function trimText(text) {
            return text.replace(/[ \t\n\r]+/g, " ");
        }

        var lastNode = null;
        var mainNodeName = null;
        var nodeUrl = "";

        // 构建当前 URL 路径（用于匹配菜单）
        if (typeof luciLocation !== 'undefined') {
            var loc = luciLocation[0] === "admin" ? [luciLocation[1], luciLocation[2]] : luciLocation;
            nodeUrl = loc.join("/");
        }

        /**
         * 根据 URL 高亮当前菜单项
         * @returns {boolean}
         */
        function getCurrentNodeByUrl() {
            if (!document.body.classList.contains('logged-in')) {
                // 未登录时不需要高亮
                return true;
            }

            var menus = document.querySelectorAll('.main > .main-left > .nav > .slide > .menu');
            var found = false;
            for (var i = 0; i < menus.length; i++) {
                var menu = menus[i];
                var submenu = menu.nextElementSibling;
                if (submenu && submenu.classList.contains('slide-menu')) {
                    var links = submenu.querySelectorAll('a');
                    for (var j = 0; j < links.length; j++) {
                        var href = links[j].getAttribute('href');
                        if (href && href.indexOf(nodeUrl) !== -1) {
                            // 模拟点击展开菜单
                            if (submenu.style.display !== 'block') {
                                menu.click();
                            }
                            lastNode = links[j].parentNode;
                            lastNode.classList.add('active');
                            found = true;
                            break;
                        }
                    }
                }
                if (found) break;
            }
            return found;
        }

        // 二级菜单点击展开/收起（使用原生 JS 替代 jQuery slide）
        var slideMenus = document.querySelectorAll('.main > .main-left > .nav > .slide > .menu');
        for (var i = 0; i < slideMenus.length; i++) {
            var menu = slideMenus[i];
            menu.addEventListener('click', function(e) {
                e.preventDefault();
                var sub = this.nextElementSibling;
                if (!sub || !sub.classList.contains('slide-menu')) return;
                if (sub.style.display === 'block') {
                    sub.style.display = 'none';
                    this.classList.remove('active');
                    sub.classList.remove('active');
                } else {
                    sub.style.display = 'block';
                    this.classList.add('active');
                    sub.classList.add('active');
                }
                return false;
            });
        }

        // 菜单项点击时添加 loading 效果和高亮
        var menuLinks = document.querySelectorAll('.main > .main-left > .nav > .slide > .slide-menu > li > a');
        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', function(e) {
                if (lastNode) lastNode.classList.remove('active');
                this.parentNode.classList.add('active');
                var loading = document.querySelector('.main > .loading');
                if (loading) loading.style.display = 'block';
                return true;
            });
        }

        // 处理菜单项本身点击（li 直接点击时跳转）
        var menuItems = document.querySelectorAll('.main > .main-left > .nav > .slide > .slide-menu > li');
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].addEventListener('click', function(e) {
                if (lastNode) lastNode.classList.remove('active');
                this.classList.add('active');
                var loading = document.querySelector('.main > .loading');
                if (loading) loading.style.display = 'block';
                var link = this.querySelector('a');
                if (link) window.location = link.getAttribute('href');
                return false;
            });
        }

        // 高亮当前菜单
        if (getCurrentNodeByUrl()) {
            var path = (typeof luciLocation !== 'undefined') ? luciLocation : [];
            if (path.length >= 2) {
                mainNodeName = 'node-' + path[0] + '-' + path[1];
                mainNodeName = mainNodeName.replace(/[ \t\n\r\/]+/g, '_').toLowerCase();
                document.body.classList.add(mainNodeName);
            }
        }

        // 设置按钮图标文字（原 jQuery 代码中设置 value，但现代浏览器可忽略，保留以备样式）
        var upButtons = document.querySelectorAll('.cbi-button-up');
        for (var i = 0; i < upButtons.length; i++) upButtons[i].value = "";
        var downButtons = document.querySelectorAll('.cbi-button-down');
        for (var i = 0; i < downButtons.length; i++) downButtons[i].value = "";

        // 为页面中所有 a 标签添加 loading 效果（不包含 onclick 的）
        var container = document.querySelector('#maincontent > .container');
        if (container) {
            var links = container.querySelectorAll('a');
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                if (!link.getAttribute('onclick')) {
                    link.addEventListener('click', function(e) {
                        var href = this.getAttribute('href');
                        if (href && href.indexOf('#') === -1) {
                            var loading = document.querySelector('.main > .loading');
                            if (loading) loading.style.display = 'block';
                        }
                        return true;
                    });
                }
            }
        }

        // 移动端菜单展开/收起
        var showSideBtn = document.querySelector('.showSide');
        var mainLeft = document.querySelector('.main-left');
        var darkMask = document.querySelector('.darkMask');
        var isMenuOpen = false;

        function closeMenu() {
            if (mainLeft) mainLeft.classList.remove('show');
            if (darkMask) darkMask.classList.remove('show');
            isMenuOpen = false;
        }

        function openMenu() {
            if (mainLeft) mainLeft.classList.add('show');
            if (darkMask) darkMask.classList.add('show');
            isMenuOpen = true;
        }

        if (showSideBtn) {
            showSideBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isMenuOpen) closeMenu();
                else openMenu();
            });
        }
        if (darkMask) darkMask.addEventListener('click', closeMenu);

        // 窗口大小改变时，如果宽度大于992px则自动关闭移动端菜单并恢复样式
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                if (mainLeft) mainLeft.style.width = '';
                if (darkMask) {
                    darkMask.style.display = 'none';
                    darkMask.classList.remove('show');
                }
                if (mainLeft) mainLeft.classList.remove('show');
                isMenuOpen = false;
            }
        });

        // 修复 legend 位置（添加 panel-title）
        var legends = document.querySelectorAll('legend');
        for (var i = 0; i < legends.length; i++) {
            var legend = legends[i];
            var span = document.createElement('span');
            span.className = 'panel-title';
            span.textContent = legend.textContent;
            legend.parentNode.insertBefore(span, legend.nextSibling);
        }

        // 页面焦点处理
        var mainRight = document.querySelector('.main-right');
        if (mainRight) {
            mainRight.focus();
            mainRight.blur();
        }

        // 设置所有 input 的 size 属性为 0（原主题风格）
        var inputs = document.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) inputs[i].setAttribute('size', '0');

        // 特定节点特殊样式修复
        if (mainNodeName) {
            switch (mainNodeName) {
                case 'node-status-system_log':
                case 'node-status-kernel_log':
                    var syslog = document.getElementById('syslog');
                    if (syslog) {
                        syslog.addEventListener('focus', function() {
                            this.blur();
                            if (mainRight) mainRight.focus();
                            if (mainRight) mainRight.blur();
                        });
                    }
                    break;
                case 'node-status-firewall':
                    var buttons = document.querySelectorAll('.node-status-firewall > .main fieldset li > a');
                    for (var i = 0; i < buttons.length; i++) {
                        buttons[i].classList.add('cbi-button', 'cbi-button-reset', 'a-to-btn');
                    }
                    break;
                case 'node-system-reboot':
                    var rebootBtn = document.querySelector('.node-system-reboot > .main > .main-right p > a');
                    if (rebootBtn) rebootBtn.classList.add('cbi-button', 'cbi-input-reset', 'a-to-btn');
                    break;
            }
        }
    });
})();
