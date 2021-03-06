//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

  /**
   * 加载进度界面
   * Process interface loading
   */
  private loadingView: LoadingUI;

  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {

    egret.lifecycle.addLifecycleListener((context) => {
      // custom lifecycle plugin

      context.onUpdate = () => {
      }
    })

    egret.lifecycle.onPause = () => {
      egret.ticker.pause();
    }

    egret.lifecycle.onResume = () => {
      egret.ticker.resume();
    }


    //设置加载进度界面
    //Config to load process interface
    this.loadingView = new LoadingUI();
    this.stage.addChild(this.loadingView);

    //初始化Resource资源加载库
    //initiate Resource loading library
    RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
    RES.loadConfig("resource/default.res.json", "resource/");
  }

  /**
   * 配置文件加载完成,开始预加载preload资源组。
   * configuration file loading is completed, start to pre-load the preload resource group
   */
  private onConfigComplete(event: RES.ResourceEvent): void {
    RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
    RES.loadGroup("preload");
  }

  /**
   * preload资源组加载完成
   * Preload resource group is loaded
   */
  private onResourceLoadComplete(event: RES.ResourceEvent) {
    if (event.groupName == "preload") {
      this.stage.removeChild(this.loadingView);
      RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
      RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
      RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
      RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
      this.createGameScene();
    }
  }

  /**
   * 资源组加载出错
   *  The resource group loading failed
   */
  private onItemLoadError(event: RES.ResourceEvent) {
    console.warn("Url:" + event.resItem.url + " has failed to load");
  }

  /**
   * 资源组加载出错
   *  The resource group loading failed
   */
  private onResourceLoadError(event: RES.ResourceEvent) {
    //TODO
    console.warn("Group:" + event.groupName + " has failed to load");
    //忽略加载失败的项目
    //Ignore the loading failed projects
    this.onResourceLoadComplete(event);
  }

  /**
   * preload资源组加载进度
   * Loading process of preload resource group
   */
  private onResourceProgress(event: RES.ResourceEvent) {
    if (event.groupName == "preload") {
      this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
    }
  }

  private textfield: egret.TextField;

  /**
   * 创建游戏场景
   * Create a game scene
   */
  private async createGameScene() {
    // 设置整体背景
    const bg: egret.Bitmap = new egret.Bitmap(RES.getRes('bg'));  // 新建一个位图对象，游戏背景图
    bg.width = this.stage.stageWidth;       // 将图片的宽度设置成舞台的宽度
    bg.height = this.stage.stageHeight;     // 将图片的高度设置成舞台的高度
    this.addChild(bg);      // 添加图片进根容器

    // 舞台第一幕
    let layerBegin: LayerBegin = new LayerBegin();    // 新建实例
    this.addChild(layerBegin);  // 添加进根容器
    layerBegin.init();  // 初始化第一个场景

    // 等待第一幕执行完毕
    await layerBegin.waitToDone();
    this.removeChild(layerBegin); // 从根容器中移除实例
    layerBegin = null;            // 删除引用

    // 舞台第二幕
    let layerGame = new LayerGame();
    this.addChild(layerGame);
    layerGame.init();
  }

  /**
   * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
   * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
   */
  private createBitmapByName(name: string) {
    let result = new egret.Bitmap();
    let texture: egret.Texture = RES.getRes(name);
    result.texture = texture;
    return result;
  }

  /**
   * 描述文件加载成功，开始播放动画
   * Description file loading is successful, start to play the animation
   */
  private startAnimation(result: string[]) {
    let parser = new egret.HtmlTextParser();

    let textflowArr = result.map(text => parser.parse(text));
    let textfield = this.textfield;
    let count = -1;
    let change = () => {
      count++;
      if (count >= textflowArr.length) {
        count = 0;
      }
      let textFlow = textflowArr[count];

      // 切换描述内容
      // Switch to described content
      textfield.textFlow = textFlow;
      let tw = egret.Tween.get(textfield);
      tw.to({ "alpha": 1 }, 200);
      tw.wait(2000);
      tw.to({ "alpha": 0 }, 200);
      tw.call(change, this);
    };

    change();
  }
}


