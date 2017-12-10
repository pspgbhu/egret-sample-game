class Player extends egret.Sprite {
  private touchStartX: number;
  private touchStartY: number;
  private TargetStartX: number;
  private TargetStartY: number;
  private img: egret.Bitmap;

  public constructor() {
    super();
  }

  public init() {
    this.draw();  // 绘制人物
    this.bindEvent();   // 绑定事件
    // 监听从舞台移除的事件
    this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.handleDistory, this);
  }

  public waitAnimationDone(): Promise<void> {
    return new Promise(resolve => {
      // 执行一段动画，人物闪烁
      const tw = egret.Tween.get(this.img);
      tw.to({ alpha: 0.5 }, 400).wait(0)
        .to({ alpha: 1 }, 400).wait(0)
        .to({ alpha: 0.5 }, 400).wait(0)
        .to({ alpha: 1 }, 400).wait(0)
        .to({ alpha: 0.5 }, 400).wait(0)
        .to({ alpha: 1 }, 400).call(() => {
          // 动画执行完毕后就可以通知上层容器了。
          resolve();
        });
    });
  }

  public removeEventHandle() {
    this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.handleTouchBegin, this);
    this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.handleTouchEnd, this);
    this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.handleTouchMove, this);
  }

  // 绘制人物图像
  private draw() {
    this.width = 172;
    this.height = 213;
    this.x = this.stage.stageWidth / 2 - this.width / 2;
    this.y = 250;

    this.img = new egret.Bitmap(RES.getRes("player"));
    this.img.width = this.width;
    this.img.height = this.height;
    this.addChild(this.img);
  }

  // 绑定触摸事件
  private bindEvent(): void {
    this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.handleTouchBegin, this);
    this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouchEnd, this);
  }

  private handleTouchBegin(e: egret.TouchEvent): void {
    this.touchStartX = e.stageX;
    this.touchStartY = e.stageY; this.TargetStartX = this.x; this.TargetStartY = this.y;
    this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.handleTouchMove, this);
  }


  private handleTouchEnd(e: egret.TouchEvent): void {
    this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.handleTouchMove, this);
  }

  // 人物跟随手指的移动而左右移动
  private handleTouchMove(e: egret.TouchEvent): void {
    const moveX: number = e.stageX - this.touchStartX;
    let moveToX = this.TargetStartX + moveX;

    // 设置左右移动的边界
    if (moveToX > this.stage.stageWidth - this.width / 2) {
      moveToX = this.stage.stageWidth - this.width / 2
    } else if (moveToX < -this.width / 2) {
      moveToX = -this.width / 2;
    }

    // 改变图层的位置
    this.x = moveToX;
  }

  // 从舞台移除后，需要手动移除各种监听的事件
  private handleDistory() {
    this.removeEventHandle();
  }
}

