class Flyer extends egret.Sprite {
  public coled: boolean;    // 标记元素是不是已经产生过碰撞了，避免多次重复触发碰撞事

  private img: egret.Bitmap;

  constructor() {
    super();
    this.coled = false;
  }

  public init(): void {
    this.img = new egret.Bitmap(RES.getRes('monster'));
    this.img.width = 111;
    this.img.height = 105;

    // 随机的产生 x 轴的值
    this.x = Math.round(Math.random() * (this.stage.stageWidth - this.width));
    // y 轴大于屏幕的高度，保证元素一开始在舞台外面
    this.y = this.stage.stageHeight + this.img.height;

    this.addChild(this.img);
  }

  // 飞行物飞出舞台时会执行 resolve
  public toFly(fn): Promise<void> {
    return new Promise((resolve, reject) => {
      const tw = egret.Tween.get(this, {
        onChange: fn,
      });
      tw.to({ y: -this.img.height }, 1000).call(() => resolve());
    });
  }
}
