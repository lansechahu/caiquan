/*
分享部分
 */

import $ from 'jquery';
import wx from 'weixin-js-sdk';

export default class Sharejs {
    constructor() {
        this.shareObj = {
            sharePath: "", //分享地址
            shareImg: "", //分享图片
            shareTitle: '', //分享title
            shareDesc: "" //分享描述
        };
    }

    init() {
        let that = this;
        let url = location.href;
        url = url.replace(/&/g, "(");

        $.ajax({
            type: "get",
            url: "http://www.blueteapot.cn/tdh/jssdk.php?url=" + url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
            success: function (data) {
                if (data.errcode) {
                    alert(data.errmsg);
                    return;
                }
                that.configWxShare(data);
            },
            error: function (data) {
            }
        });
    }

    configWxShare(data) {
        let that = this;
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ"
            ]
        });

        wx.ready(function () {
            /*wx.hideMenuItems({
                menuList: [
                    'menuItem:share:qq',
                    'menuItem:share:weiboApp',
                    'menuItem:share:facebook',
                    'menuItem:share:QZone',
                    'menuItem:editTag',
                    'menuItem:delete',
                    'menuItem:copyUrl',
                    'menuItem:originPage',
                    'menuItem:readMode',
                    'menuItem:openWithQQBrowser',
                    'menuItem:openWithSafari',
                    'menuItem:share:email',
                    'menuItem:share:brand'
                ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });*/
            that.setShare();
        });
    }

    setShare() {
        let that = this;
        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: that.shareObj.shareTitle, // 分享标题
            link: that.shareObj.sharePath, // 分享链接
            imgUrl: that.shareObj.shareImg, // 分享图标
            success: function () {
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: that.shareObj.shareTitle, // 分享标题
            desc: that.shareObj.shareDesc, // 分享描述
            link: that.shareObj.sharePath, // 分享链接
            imgUrl: that.shareObj.shareImg, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    }
}