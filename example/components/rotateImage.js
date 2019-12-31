import EXIF from 'exif-js'

const rotateCTX = (orientation, image, width, height) => {
  const can = document.createElement('canvas')
  const ctx = can.getContext('2d')
  can.width = width
  can.height = height
  ctx.save()

  if (orientation) {
    if (orientation > 4) {
      can.width = height
      can.height = width
    }

    switch (orientation) {
      case 2:
        ctx.translate(width, 0)
        ctx.scale(-1, 1)
        break
      case 3:
        ctx.translate(width, height)
        ctx.rotate(Math.PI)
        break
      case 4:
        ctx.translate(0, height)
        ctx.scale(1, -1)
        break
      case 5:
        ctx.rotate(0.5 * Math.PI)
        ctx.scale(1, -1)
        break
      case 6:
        ctx.rotate(0.5 * Math.PI)
        ctx.translate(0, -height)
        break
      case 7:
        ctx.rotate(0.5 * Math.PI)
        ctx.translate(width, -height)
        ctx.scale(-1, 1)
        break
      case 8:
        ctx.rotate(-0.5 * Math.PI)
        ctx.translate(-width, 0)
        break
    }
  }

  ctx.drawImage(image, 0, 0, width, height)
  ctx.restore()

  return { canvas: can, ctx }
}

const rotateImage = (img, onRotate = () => {}, onError = console.error) => {
  try {
    EXIF.getData(img, function() {
      const orientation = EXIF.getTag(this, 'Orientation')
      const { canvas } = rotateCTX(orientation, img, img.width, img.height)
      canvas.toBlob(onRotate)
    })
  } catch (error) {
    onError(error)
  }
}

export const readAndRotate = (file, onRotate, onError) => {
  if (file) {
    if (typeof window.FileReader !== 'function') {
      console.log('Can\t rotate image')
      return
    }
    const fr = new FileReader()
    fr.onload = () => {
      const img = new Image()
      img.onload = () => rotateImage(img, onRotate, onError)
      img.src = fr.result
    }
    fr.readAsDataURL(file)
  }
}

export default rotateImage
