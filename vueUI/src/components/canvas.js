let instance;

function getStyle(d) {
  let width = document.defaultView.getComputedStyle(d).width;
  let height = document.defaultView.getComputedStyle(d).height;
  height = parseFloat(height, 0);
  width = parseFloat(width, 0) / 2;
  const style = { width, height };
  return style;
}

function drawRect(x, y, width, height) {
	this.beginPath();
	this.moveTo(x, y);
	this.lineTo(x + width, y);
	this.lineTo(x + width, y + height);
	this.lineTo(x, y + height);
	this.strokeStyle = "black";
	this.fillStyle = "white";
	this.fill();
	this.closePath();
	this.stroke();
	this.font = "black";
	this.strokeText("h", 10, 10);
	this.stroke();
}

function drawChartTable(chartDom) {
  const ctx = chartDom.getContext('2d');
  let ew = getStyle(chartDom).width;
  const eh = getStyle(chartDom).height / 13;
  let lastew;
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 11; j++) {
      if (i === 0) {
				ew = getStyle(chartDom).width * (10 / 12);
				let rect = drawRect.bind(ctx);
				rect(0, (j - 1) * eh, ew, eh);
      } else {
        lastew = getStyle(chartDom).width * ( 2 / 12);
				let rect = drawRect.bind(ctx);
				if (i === 1) {
				  rect(i * ew, (j - 1) * eh, lastew, eh);
				} else {
				  rect(i * lastew, (j - 1) * eh, lastew, eh);				
				}
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
