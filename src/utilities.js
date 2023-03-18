export const drawRect = (detections, ctx, description) => {
    detections.forEach(prediction => {
        // get prediction
        const [x,y,width,height] = prediction['bbox']
        const text = prediction['class']

        // set styling
        const color = 'green'
        ctx.strokeStyle = color
        ctx.font = '24px Poppins'
        ctx.fillStyle = color

        // draw rects and text
        ctx.beginPath()
        ctx.fillText(text, x, y)
        
        ctx.rect(x, y, width, height)
        ctx.stroke()

    })
}