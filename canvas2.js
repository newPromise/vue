let instance;
const locatCase = [[1, 2], [2, 2], [3, 6], [4, 6], [5, 5]];
let lastLineCase;

function getStyle(d) {
  let width = document.defaultView.getComputedStyle(d).width;
  let height = document.defaultView.getComputedStyle(d).height;
  height = parseFloat(height, 0) / 2;
  width = parseFloat(width, 0) / 2;
  const style = { width, height };
  return style;
}
// 画直线
function drawRedLine(x, y) {
  if (lastLineCase === undefined) {
    lastLineCase = [];
    lastLineCase.push([x, y]);
    this.moveTo(x, y);
    return;
  }
  const line = lastLineCase.shift();
  this.beginPath();
  this.moveTo(line[0], line[1]);
  this.lineTo(x, y);
  this.strokeStyle = 'red';
  this.lineWidth = '3';
  this.stroke();
  this.closePath();
  lastLineCase.push([x, y]);
  console.log('yessssssss', lastLineCase);
  console.log('line', [x, y]);
}

// 画方框
function drawRect(x, y, width, height) {
  this.beginPath();
  this.moveTo(x, y);
  this.lineTo((x + width), y);
  this.lineTo((x + width), (y + height));
  this.lineTo(x, (y + height));
  this.strokeStyle = 'gray';
  this.fillStyle = 'white';
  // this.fill();
  this.closePath();
  this.stroke();
  this.font = 'gray';
  // this.strokeText('期号', 10, 10);
  // this.stroke();
}

// 绘制获奖号码为圆形
function drawRedCircle(x, y, text) {
  this.beginPath();
  this.fillstyle = 'red';
  this.arc(x, y, 20, 0, Math.PI * 2, true);
  this.fillStyle = 'red';
  this.closePath();
  this.fill();
  this.fillStyle = 'white';
  this.fillText(text, x, y);
  this.textAlign = 'center';
  this.textBaseline = 'middle';
}

// 绘制canvas 画布
function drawChartTable(chartDom) {
  console.log('locatCase', locatCase);
  const ctx = chartDom.getContext('2d');
  let ew = getStyle(chartDom).width;
  const eh = getStyle(chartDom).height / 13;
  ctx.textAlign = 'middle';
  let lastew;
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 13; j++) {
      /* i 表示列， j 表示行 */
      /* if 第一列 */
      if (i === 0) {
        ew = getStyle(chartDom).width * (3 / 13);
        const rect = drawRect.bind(ctx);
        ctx.fillStyle = 'black';
        // 如果第一行， 第一列, 写入期号
        if (j === 0) {
          ctx.font = '80px';
          ctx.fillText('期号', 0, eh * (j + 0.5));
        } else if (j <= 10 && j > 0) {
          ctx.fillText('201321021234', 0, eh * (j + 0.5));
        } else if (j === 11) {
          ctx.fillText('平均遗漏', 0, eh * (j + 0.5));
        } else if (j === 12) {
          ctx.fillText('最大遗漏', 0, eh * (j + 0.5));
        }
        rect(0, j * eh, ew, eh);
        ctx.font = 'lighter 20px Arial';
      } else {
        lastew = getStyle(chartDom).width * (1 / 13);
        const rect = drawRect.bind(ctx);
        if (i === 1) {
          rect(ew, j * eh, lastew, eh);
        } else {
          rect(((i - 1) * lastew) + ew, j * eh, lastew, eh);
        }
        if (j === 0) {
          ctx.fillStyle = 'black';
          const num = i - 1;
          ctx.fillText(num, ((i - 1) * lastew) + ew + 10, 50);
        } else if (j <= 10) {
          ctx.fillStyle = 'black';
          ctx.fillText(j, ((i - 1) * lastew) + ew + 10, eh * (j + 0.5));
          const chartCircle = drawRedCircle.bind(ctx);
          const chartLine = drawRedLine.bind(ctx);
          const isCode = function (element) {
            return i === (element[1] + 1) && j === element[0];
          };
          const code = locatCase.some(isCode);
          if (code) {
            chartCircle(((i - 1) * lastew) + (ew) + (lastew / 2), eh * (j + 0.5), i - 1);
            chartLine(((i - 1) * lastew) + (ew) + (lastew / 2), eh * (j + 0.5));
          }
        }
      }
    }
  }
}

function setOptions(options = {}) {
  const datas = options.data;
  if (datas) {
    datas.map((item, index) => {
      const a = [];
      a.push(index + 1);
      a.push(Number(item.gameNo));
      locatCase.push(a);
      return item;
    });
  }
  console.log(locatCase);
}

function ChartConstructor(dom) {
  const chartDom = dom;
  this.tOptions = setOptions;
  drawChartTable(chartDom);
  // this.draw = (drawChartTable(chartDom));
}


function initInstance(dom) {
  instance = new ChartConstructor(dom);
  return instance;
}

function init(dom) {
  return initInstance(dom);
}

// gameNo 获奖号码

const trendChart = {
  init
};

export default trendChart;
