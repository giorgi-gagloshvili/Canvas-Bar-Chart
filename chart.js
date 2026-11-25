import { data, bubbles } from "./data.js";

async function createChart(type, data = []) {
  const canvas = document.getElementById("bar-chart");
  const ctx = canvas.getContext("2d");

  //   console.log(ctx);
  // canvas.style.background = "red";

  canvas.width = canvas.width === 300 ? 1280 : canvas.width;
  canvas.height = canvas.height === 150 ? 560 : canvas.height;

  console.log({ width: canvas.width });

  let margin = 40;
  let colMargin = 20;

  const gridWidth = canvas.width - margin * 2;
  const gridHeight = canvas.height - margin * 2;

  switch (type) {
    case "bar":
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
      let { limit, numbers } = getMaxValue(data, "value");
      numbers = numbers.reverse();

      drawGrid(type, canvas, ctx, margin, gridWidth, gridHeight, data.length);
      drawRowLabels(ctx, margin, gridHeight, numbers);

      for (let i = 0; i < data.length; i++) {
        const percent = (data[i].value / limit) * 100;
        const height = (percent / 100) * gridHeight;
        console.log(height);
        ctx.fillStyle = data[i].bgColor
          ? data[i].bgColor
          : "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(
          (i * gridWidth) / data.length + margin + colMargin / 2,
          gridHeight - height + margin,
          gridWidth / data.length - colMargin,
          height,
        );

        // Draws label text items
        await document.fonts.ready;
        ctx.font = "14px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#666";

        ctx.fillText(
          data[i].label,
          (i * gridWidth) / data.length + margin + gridWidth / data.length / 2,
          gridHeight + margin + 20,
        );
      }
      break;

    case "bubble":
      let { limit: x, numbers: xNumbers } = getMaxValue(data, "x");
      let { limit: y, numbers: yNumbers } = getMaxValue(data, "y");
      yNumbers = yNumbers.reverse();
      drawGrid(type, canvas, ctx, margin, gridWidth, gridHeight, data.length);
      drawRowLabels(ctx, margin, gridHeight, yNumbers);
      drawColumnLabels(ctx, margin, gridWidth, canvas.height, xNumbers);

      for (let i = 0; i < data.length; i++) {
        const bubble = data[i];
        const percentX = (bubble.x / x) * 100;
        const positionX = (percentX / 100) * gridWidth;
        const percentY = (bubble.y / y) * 100;
        const positionY = gridHeight - (percentY / 100) * gridHeight;
        ctx.fillStyle = bubble.bgColor;
        ctx.beginPath();
        ctx.arc(
          positionX + margin,
          positionY + margin,
          bubble.value,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.stroke();
      }
      break;

    case "line":
      let { limit: lineLimit, numbers: lineNumbers } = getMaxValue(
        data,
        "value",
      );
      lineNumbers = lineNumbers.reverse();

      drawGrid(type, canvas, ctx, margin, gridWidth, gridHeight, data.length);
      drawRowLabels(ctx, margin, gridHeight, lineNumbers);
      let positionX = null;
      let positionY = null;
      let columnSize = gridWidth / data.length;

      for (let i = 0; i < data.length; i++) {
        const percent = (data[i].value / lineLimit) * 100;
        const height = gridHeight - (percent / 100) * gridHeight;
        ctx.beginPath();
        ctx.arc(i * columnSize + margin, height + margin, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();

        if (i === 0) {
          const percent = (data[i + 1].value / lineLimit) * 100;
          const firstLineHeight = gridHeight - (percent / 100) * gridHeight;
          positionX = columnSize * (i + 1);
          positionY = firstLineHeight;
          // console.log("Pizdec", height + margin, positionY);
          ctx.moveTo(i * columnSize + margin, height + margin);
          ctx.lineTo(positionX + margin, firstLineHeight + margin);
        } else if (i === data.length - 1) {
          console.log(i);
          ctx.moveTo(positionX + margin, positionY);
        } else {
          const percent = (data[i + 1].value / lineLimit) * 100;
          const height = gridHeight - (percent / 100) * gridHeight;
          ctx.moveTo(positionX + margin, positionY + margin);
          ctx.lineTo(columnSize * (i + 1) + margin, height + margin);
          positionX = columnSize * (i + 1);
          positionY = height;
        }

        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.stroke();
        ctx.closePath();
        // Draws label text items
        await document.fonts.ready;
        ctx.font = "14px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#666";

        ctx.fillText(
          data[i].label,
          (i * gridWidth) / data.length + margin + gridWidth / data.length / 2,
          gridHeight + margin + 20,
        );
      }

      break;
  }
}

// createChart("bubble", bubbles);
// createChart("bar", data);
createChart("line", data);

function drawGrid(type, canvas, ctx, margin, width, height, length) {
  // Draw chart rectangle
  if (type === "bubble") length = 10;
  ctx.strokeStyle = "#e5e5e5";
  ctx.strokeRect(
    margin,
    margin,
    canvas.width - margin * 2,
    canvas.height - margin * 2,
  );

  for (let i = 0; i < 11; i++) {
    if (i === 0) continue;
    ctx.beginPath();

    ctx.moveTo(margin, margin + (i * height) / 10);
    ctx.lineTo(margin + width, margin + (i * height) / 10);

    ctx.strokeStyle = "#ddd";
    ctx.stroke();
    ctx.closePath();
  }

  for (let i = 0; i < length; i++) {
    if (i === 0) continue;
    ctx.beginPath();

    ctx.moveTo(margin + (i * width) / length, margin);
    ctx.lineTo(margin + (i * width) / length, margin + height);

    ctx.strokeStyle = "#e5e5e5";
    ctx.stroke();
    ctx.closePath();
  }
}

async function drawRowLabels(ctx, margin, height, numbers) {
  // Draws numbers text
  for (let i = 0; i < numbers.length; i++) {
    await document.fonts.ready;
    ctx.font = "12px 'Montserrat', sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "#666";
    ctx.fillText(numbers[i], margin - 5, (height / 10) * i + margin + 5); // Dynamic value is needed
  }
}

async function drawColumnLabels(ctx, margin, width, height, numbers) {
  for (let i = 0; i < numbers.length; i++) {
    await document.fonts.ready;
    ctx.font = "12px 'Montserrat', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    ctx.fillText(numbers[i], (width / 10) * i + margin, height - margin / 2); // Dynamic value is needed
  }
}

function getMaxValue(data, identifier) {
  let values = data.map((item) => item[identifier]);
  let limit = 0;
  const numbers = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i] > limit) limit = values[i];
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

// console.log(getMaxValue(data));
console.log(100 / 3);
