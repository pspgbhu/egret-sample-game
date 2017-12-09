abstract class Flyer extends egret.Sprite {

  abstract type: string;          //  子类的类型，是 ‘gift’ 还是 'monster'
  abstract img: egret.Bitmap;     //  子类的图片
  abstract beforeInit(): void;    //  钩子函数

  public coled: boolean;    // 标记元素是不是已经产生过碰撞了，避免多次重复触发碰撞事

  constructor() {
    super();
    this.coled = false;
  }

  public init(): void {
    this.beforeInit();
    // 随机的产生 x 轴的值
    this.x = Math.round(Math.random() * (this.stage.stageWidth - this.width));
    // y 轴大于屏幕的高度，保证元素一开始在舞台外面
    this.y = this.stage.stageHeight + this.img.height;
  }

  // 飞行物飞出舞台时会执行 resolve
  public waitToFlyOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tw = egret.Tween.get(this);
      tw.to({ y: -this.img.height }, 1200).call(() => resolve());
    });
  }
}
