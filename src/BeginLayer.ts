class BeginLayer extends egret.DisplayObjectContainer {

  constructor() {
    super();
  }

  public init() {
    // 新建一个位图对象，游戏标题
    const title: egret.Bitmap = new egret.Bitmap(RES.getRes('title'));
    title.width = 549;
    title.height = 154;
    title.x = (this.stage.stageWidth - 549) / 2;   // 左右居中
    title.y = 300;

    this.addChild(title);
  }

  // 通知上层容器，该实例需要从舞台移除
  public waitToDone(): Promise<void> {
    return new Promise(resolve => {
      const handleTap = () => {
        // 不要忘记卸载事件
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, handleTap, this);
        resolve();
      }

      // 当用户点击页面时，触发事件
      this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, handleTap, this);
    });
  }
}
