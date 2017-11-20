import Draw from './charts';
/*eslint class-methods-use-this: "error"*/
/*eslint class-methods-use-this: 0*/
class Chart {
  constructor() {
    this.ctxAxis = null;
    // 走势图主体
    this.ctxMain = null;
    // canvas 或者坐标轴高度 // 宽度
    this.canvasHeight = '';
    this.canvasWidth = '';
    // 走势图部分宽度和高度
    this.trendTabelHeight = '';
    this.trendTableWidth = '';
    this.drawAxis = '';
    this.drawMain = '';
    this.offSet = 30;
    this.yNum = 10;
    // y 轴的长度
    this.yaxisLen = 0;
    // x 轴的长度
    this.xaxisLen = 0;
  }
  style() {
    this.canvasHeight = this.ctxAxis.canvas.clientHeight;
    this.canvasWidth = this.ctxAxis.canvas.clientWidth;
    this.trendTabelHeight = this.ctxMain.canvas.clientHeight;
    this.trendTableWidth = this.ctxMain.canvas.clientWidth;
  }
  init(canvasDom, canvasBody) {
    if (!canvasDom) return;
    const ctxAxis = canvasDom.getContext('2d');
    this.ctxAxis = ctxAxis;
    this.ctxMain = canvasBody.getContext('2d');
    this.drawAxis = new Draw(this.ctxAxis);
    this.drawMain = new Draw(this.ctxMain);
    console.log('ctxBody', canvasBody);
    console.log(ctxAxis);
  }
  setOption(config) {
    const defaultConfig = {
      yaxis: [],
      xaxis: []
    };
    config = Object.assign({}, config, defaultConfig);
    console.log(config);
    this.style();
    document.getElementById('anotherCanvas').style.padding = '30px';
    document.getElementById('anotherCanvas').style.paddingTop = 0;
    this.drawXaxis(3000);
    this.drawYaxis(1000);
    this.drawTrendCanvas();
  }
  drawYaxis(height) {
    const start = {
      x: 0,
      y: 0
    };
    const end = {
      x: 0,
      y: 0
    };
    start.x = this.offSet;
    end.x = this.offSet;
    start.y = this.canvasHeight - this.offSet;
    end.y = this.canvasHeight - height;
    this.yaxisLen = start.x - end.x;
    this.drawAxis.line(start, end);
    // 绘制步进
    this.drawAxis.stepLine('yaxis', this.offSet, 400, 20);
  }
  // 绘制走势图
  drawTrendCanvas() {
    // 下面是通过使用 从config 得到的变量值
    this.drawTrendTable();
  }
  // 绘制走势图线段
  drawTrendTable() {
    const start = {
      x: 0,
      y: 0
    };
    const end = {
      x: 0,
      y: 0
    };
    const hei = this.trendTabelHeight;
    const wid = this.trendTableWidth;
    let i = 0;
    console.log('得到的高度', hei);
    const eh = 60;
    const ew = 60;
    // const ew = wid / 10;
    // 画横线
    for (; i <= 10; i++) {
      start.y = i * eh;
      end.y = start.y;
      end.x = wid;
      this.drawMain.line(start, end);
    }
    // 画竖线
    i = 0;
    for (; i <= 10; i++) {
      start.y = 0;
      start.x = i * ew;
      end.x = start.x;
      end.y = hei;
      this.drawMain.line(start, end);
    }
  }
  drawXaxis(width) {
    const start = {
      x: 0,
      y: 0
    };
    const end = {
      x: 0,
      y: 0
    };
    start.y = this.canvasHeight - this.offSet;
    end.y = this.canvasHeight - this.offSet;
    start.x = this.offSet;
    end.x = width;
    this.drawAxis.line(start, end);
  }
}
export default new Chart();
