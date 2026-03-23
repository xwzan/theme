#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Netgear Theme
LUCI_DEPENDS:=+luci-base
LUCI_PKGARCH:=all

PKG_VERSION:=1.0
PKG_RELEASE:=2
PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Your Name <your@email.com>

# 明确指定 LuCI 类型
LUCI_TYPE:=theme

include $(TOPDIR)/feeds/luci/luci.mk

# 添加自定义安装后操作
define Package/luci-theme-netgear/postinst
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	rm -rf /tmp/luci-indexcache
	exit 0
}
endef

# 调用构建
# call BuildPackage - OpenWrt buildroot signature
