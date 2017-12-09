var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BeginLayer = (function (_super) {
    __extends(BeginLayer, _super);
    function BeginLayer() {
        return _super.call(this) || this;
    }
    BeginLayer.prototype.init = function () {
        // 新建一个位图对象，游戏标题
        var title = new egret.Bitmap(RES.getRes('title'));
        title.width = 549;
        title.height = 154;
        title.x = (this.stage.stageWidth - 549) / 2; // 左右居中
        title.y = 300;
        this.addChild(title);
    };
    // 通知上层容器，该实例需要从舞台移除
    BeginLayer.prototype.waitToDone = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var handleTap = function () {
                // 不要忘记卸载事件
                _this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, handleTap, _this);
                resolve();
            };
            // 当用户点击页面时，触发事件
            _this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, handleTap, _this);
        });
    };
    return BeginLayer;
}(egret.DisplayObjectContainer));
__reflect(BeginLayer.prototype, "BeginLayer");
