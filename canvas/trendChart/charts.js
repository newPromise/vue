class Draw {
  constructor(ctx) {
    this.ctx = ctx;
  }
  line(previous, target) {
    this.ctx.beginPath();
    this.ctx.moveTo(previous.x, previous.y);
    this.ctx.lineTo(target.x, target.y);
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
    console.log(previous, target);
  }
  // 步进线 type: 哪个坐标轴的步进线 offset: 距离
  stepLine(type, x, y, length) {
    const start = {
      x: 0,
      y: 0
    };
    const end = {
      x: 0,
      y: 0
    };
    if (type === 'yaxis') {
      start.x = x - length;
      end.x = x;
      start.y = y;
      end.y = y;
      this.line(start, end);
    } else if (type === 'xaxis') {
      start.x = x;
      end.x = x;
      start.y = y - length;
      end.y = y;
      this.line(start, end);
    }
  }
}

export default Draw;
