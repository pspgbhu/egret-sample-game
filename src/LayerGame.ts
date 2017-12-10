class LayerGame extends egret.DisplayObjectContainer {
  private player: Player;
  private isGameOver: boolean;
  private beginTime: number;

  constructor() {
    super();
  }

  init() {
    this.player = new Player();   // 实例化玩家
    this.addChild(this.player);   // 添加进容器
    this.player.init();           // 初始化玩家

    this.addFlyers();             // 添加飞行物
    this.beginTime = new Date().getTime();  // 游戏开始的时间
  }

  addFlyers() {
    // 持续添加飞行物
    let timer = () => {
      setTimeout(() => {
        if (this.isGameOver) return;
        this.addOneFlyer();       // 添加一个飞行物
        timer();
      }, 500);
    }
    timer();
  }

  async addOneFlyer() {
    const flyer: Flyer = new Flyer();
    this.addChild(flyer);
    flyer.init();

    await flyer.toFly(() => {   // 动画每一帧都会调用该函数
      // 判断是否碰撞
      const isColl = this.collisionsDetection(flyer, this.player);
      if (isColl) {
        // 碰撞了调用相应的处理程序
        this.handleCollision();
      }
    });
  }

  // AABB 碰撞检测
  private collisionsDetection(one: egret.DisplayObject, two: egret.DisplayObject): boolean {
    let collisionX: boolean = one.x + one.width >= two.x &&
      two.x + two.width >= one.x;
    let collisionY: boolean = one.y + one.height >= two.y &&
      two.y + two.height >= one.y;
    return collisionX && collisionY;
  }

  // 碰撞后的处理程序
  private handleCollision() {
    this.isGameOver = true;
    // 取消全部动画
    egret.Tween.removeAllTweens();
    // 删除了绑定在 player 上的触摸事件
    this.player.removeEventHandle();

    const gameTime = Math.ceil((new Date().getTime() - this.beginTime) / 1000);
    alert(`大侠您支撑了 ${gameTime} 秒`);
    window.location.reload();
  }
}
