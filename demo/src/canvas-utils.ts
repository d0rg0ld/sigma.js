import { NodeDisplayData, PartialButFor, PlainObject } from "sigma/types";
import { Settings } from "sigma/settings";

const TEXT_COLOR = "#000000";

/**
 * This function draw in the input canvas 2D context a rectangle.
 * It only deals with tracing the path, and does not fill or stroke.
 */
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Custom hover renderer
 */
export function drawHover(context: CanvasRenderingContext2D, data: PlainObject, settings: PlainObject) {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  const subLabelSize = size - 2;

	const label = data.title=="null" ? data.label : data.title;
	const subLabel = (data.tag !== "unknown" && data.title!="null") ? data.tag : "";
	const clusterLabel = (data.title!="null") ? data.clusterLabel : "";

  // Then we draw the label background
  context.beginPath();
  context.globalAlpha= 0.7;
  //context.fillStyle = 'rgba(255,255,255,.9)';
  context.fillStyle = '#fff';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 8;
  context.shadowColor = "#000";

  context.font = `${weight} ${size}px ${font}`;
  
  var tokens=label.split(" ");
  var lines= [];
  var lindex=-1;
  var labidx=0;
  var maxlinelen=30;
  var linelengths=[];
  var maxl=-100;
  var maxidx=-1;
  
  for (var t in tokens) {
	  if (lindex==-1) {
		  lindex=0;
		  lines[lindex]=tokens[t];
		  continue;
	  }
	  if (lines[lindex].length < maxlinelen)
		  lines[lindex]+=(" " + tokens[t]);
	  else {
		  linelengths[lindex]=lines[lindex].length;
		  if (linelengths[lindex]>maxl) {
			  maxl=linelengths[lindex];
			  maxidx=lindex;
		  }
		  lindex+=1;
		  lines[lindex]=tokens[t];
	  }
  }
  linelengths[lindex]=lines[lindex].length;
  if (linelengths[lindex]>maxl) {
	  maxl=linelengths[lindex];
	  maxidx=lindex;
  }
  
  console.log(lines);
  
  const labelWidth = context.measureText(lines[maxidx]).width;
  
  
  
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const subLabelWidth = subLabel ? context.measureText(subLabel).width : 0;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const clusterLabelWidth = clusterLabel ? context.measureText(clusterLabel).width : 0;

  const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth);

  const x = Math.round(data.x);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size / 2 + data.size + 3);
  
  const hLabel = Math.round((size )*lines.length + 4);
  
  const hSubLabel = subLabel ? Math.round(subLabelSize / 2 + 9) : 0;
  const hClusterLabel = Math.round(subLabelSize / 2 + 9);

  drawRoundRect(context, x, y - hSubLabel - 12, w, hClusterLabel + hLabel + hSubLabel + 12, 5);
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // And finally we draw the labels
  context.fillStyle = TEXT_COLOR;
  context.font = `${weight} ${size}px ${font}`;
  
	for (let i = 0; i < lines.length; i++)
		context.fillText(lines[i], data.x + data.size + 3, data.y + (size )*(i+1));
  //context.fillText(label, data.x + data.size + 3, data.y + size / 3);

  if (subLabel) {
    context.fillStyle = TEXT_COLOR;
    context.font = `${weight} ${subLabelSize}px ${font}`;
    context.fillText(subLabel, data.x + data.size + 3, data.y - (2 * size) / 3 - 2);
  }

  context.fillStyle = data.color;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  context.fillText(clusterLabel, data.x + data.size + 3, data.y + (size)*lines.length + 3 + subLabelSize);
}

/*
  var tokens=data.label.split(" ");
  var lines= [];
  var lindex=-1;
  var labidx=0;
  var maxlinelen=20;
  var linelengths=[];
  var maxl=-100;
  var maxidx=-1;
  
  for (var t in tokens) {
	  if (lindex==-1) {
		  lindex=0;
		  lines[lindex]=t;
	  }
	  if (lines[lindex].length < maxlinelen)
		  lines[lindex]+=(" " + t);
	  else {
		  linelengths[lindex]=lines[lindex].length;
		  if (linelengths[lindex]>maxl) {
			  maxl=linelengths[lindex];
			  maxidx=lindex;
		  }
		  lindex+=1;
		  lines[lindex]=t;
	  }
  }
  linelengths[lindex]=lines[lindex].length;
  if (linelengths[lindex]>maxl) {
	  maxl=linelengths[lindex];
	  maxidx=lindex;
  }
  
  console.log(lines);
  
  const width = context.measureText(lines[maxidx]).width + 8;

	if (data.forceLabel)
		context.fillStyle = "#000";
	else
		context.fillStyle = "#ffffffcc";
	context.fillRect(data.x + data.size, data.y + size / 3 - 10*mult, width, 15*mult*lines.length);
	if (data.forceLabel)
		context.fillStyle = "#ffffffcc";
	else
		context.fillStyle = "#000";
	for (let i = 0; i < lines.length; i++)
		context.fillText(lines[i], data.x + data.size + 3, data.y + size / 3 + i*10*mult);
*/

/**
 * Custom label renderer
 */
export default function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings,
): void {
  if (!data.label) return;

	var mult=1.0;
		if (data.forceLabel)
			mult=1.2;
	const size = settings.labelSize*mult,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.font = `${weight} ${size}px ${font}`;
  const width = context.measureText(data.label).width + 8;

	if (data.forceLabel)
		context.fillStyle = "#000";
	else
		context.fillStyle = "#ffffffcc";
	context.fillRect(data.x + data.size, data.y + size / 3 - 10*mult, width, 15*mult);
	if (data.forceLabel)
		context.fillStyle = "#ffffffcc";
	else
		context.fillStyle = "#000";
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
