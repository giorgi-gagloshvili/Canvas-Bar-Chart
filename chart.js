import { data } from "./data.js";
const canvas = document.getElementById("bar-chart");
const ctx = canvas.getContext("2d");

console.log(ctx);
// canvas.style.background = "red";

canvas.width = 1280;
canvas.height = 560;

let margin = 40;
let colMargin = 20;

// Draw chart rectangle
ctx.strokeStyle = "#e5e5e5";
ctx.strokeRect(
  margin,
  margin,
  canvas.width - margin * 2,
  canvas.height - margin * 2,
);

let { limit, numbers } = getMaxValue(data);
numbers = numbers.reverse();
const gridWidth = canvas.width - margin * 2;
const gridHeight = canvas.height - margin * 2;

// const colWidth = gridWidth / data.length;
// const rowHeight = gridHeight / 10;

// grid constructor
// for (let i = 0; i < data.length; i++) {
//   for (let j = 0; j < 10; j++) {
//     ctx.strokeStyle = "#e5e5e5  ";
//     ctx.strokeRect(
//       (i * gridWidth) / data.length + margin,
//       (j * gridHeight) / 10 + margin,
//       colWidth,
//       rowHeight,
//     );
//   }
// }

for (let i = 0; i < 11; i++) {
  if (i === 0) continue;
  ctx.beginPath();

  ctx.moveTo(margin, margin + (i * gridHeight) / 10);
  ctx.lineTo(margin + gridWidth, margin + (i * gridHeight) / 10);

  ctx.strokeStyle = "#e5e5e5";
  ctx.stroke();
  ctx.closePath();
}

// Draws numbers text
for (let i = 0; i < numbers.length; i++) {
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = "#666";
  ctx.fillText(numbers[i], margin - 5, (gridHeight / 10) * i + margin + 5); // Dynamic value is needed
}

for (let i = 0; i < data.length; i++) {
  const percent = (data[i].value / limit) * 100;
  const height = (percent / 100) * gridHeight;
  console.log(height);
  ctx.fillStyle = data[i].bgColor ? data[i].bgColor : "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(
    (i * gridWidth) / data.length + margin + colMargin / 2,
    gridHeight - height + margin,
    gridWidth / data.length - colMargin,
    height,
  );

  // Draws label text items
  ctx.font = "bold 14px 'Roboto', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#666";

  ctx.fillText(
    data[i].label,
    (i * gridWidth) / data.length + margin + gridWidth / data.length / 2,
    gridHeight + margin + 20,
  );
}

function getMaxValue(data) {
  let rData = data.map((item) => item.value);
  let limit = 0;
  const numbers = [];

  for (let i = 0; i < rData.length; i++) {
    if (rData[i] > limit) limit = rData[i];
  }

  const divider = (Math.ceil(limit / 100) * 100) / 10;
  limit = Math.ceil(limit / 100) * 100;

  for (let i = 0; i <= limit; i++) {
    if (i % divider === 0) {
      numbers.push(i);
    }
  }
  return { limit, numbers };
}

console.log(getMaxValue(data));
