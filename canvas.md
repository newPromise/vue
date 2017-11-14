```
let instance;

function getStyle(d) {
  let width = document.defaultView.getComputedStyle(d).width;
  let height = document.defaultView.getComputedStyle(d).height;
  height = parseFloat(height, 0);
  width = parseFloat(width, 0) / 2;
  console.log('width', width, d);
  const style = { width, height };
  return style;
}

function drawChartTable(chartDom) {
  const ctx = chartDom.getContext('2d');
  let ew = getStyle(chartDom).width * 0.1;
  const eh = getStyle(chartDom).height / 13;
  let lastew;
  console.log('得到宽度', getStyle(chartDom).height, eh);
  console.log('每个的宽度', ew);
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 11; j++) {
      if (i === 0) {
        ew = getStyle(chartDom).width * 0.1;
        ctx.fillRect(0, j * 60, lastew, 60);
      } else {
        lastew = getStyle(chartDom).width * 0.08;
        if (j % 2 === 0) {
          console.log('j', j);
          ctx.fillStyle = 'rgb(255, 165, 125)';
        } else {
          ctx.fillStyle = 'rgb(255, 255, 255)';
        }
        ctx.fillRect(i * ew, (j - 1) * 60, ew, 60);
      }
    }
  }
}


function ChartConstructor(dom) {
  const chartDom = dom;
  drawChartTable(chartDom);
}


function initInstance(dom) {
  instance = new ChartConstructor(dom);
  return instance;
}

function init(dom) {
  return initInstance(dom);
}


const trendChart = {
  init
};

export default trendChart;

```
