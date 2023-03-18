// export const drawRect = (detections, ctx, description) => {
//     detections.forEach(prediction => {
//         // get prediction
//         const [x,y,width,height] = prediction['bbox']
//         const text = prediction['class']

//         // set styling
//         const color = 'green'
//         ctx.strokeStyle = color
//         ctx.font = '24px Poppins'
//         ctx.fillStyle = color

//         // draw rects and text
//         ctx.beginPath()
//         ctx.fillText(text, x, y-10)
        
//         ctx.rect(x, y, width, height)
//         ctx.fillText(description, x, y+100)
//         ctx.stroke()

//     })
// }

export const drawRect = (detections, ctx, description, videoWidth) => {
    detections.forEach(prediction => {
      // get prediction
      const [x, y, width, height] = prediction['bbox'];
      const text = prediction['class'];
  
      // set styling
      const color = 'green';
      ctx.strokeStyle = color;
      ctx.font = '24px Poppins';
      ctx.fillStyle = color;
  
      // adjust coordinates for mirrored video
      const adjustedX = videoWidth - x - width;
  
      // draw rects and text
      ctx.beginPath();
      ctx.fillText(text, adjustedX, y - 10);
      ctx.rect(adjustedX, y, width, height);
      ctx.fillText(description, adjustedX, y + 100);
      ctx.stroke();
    });
  };
  