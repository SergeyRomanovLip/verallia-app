

const resizeImage = (image) => {
    let reader = new FileReader()
    let image = guest.nodes.picture
    reader.onload = function () {
        image.src = URL.createObjectURL(el.target.files[0]);
        image.onload = 'imageIsLoaded';
        setTimeout(() => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            let MAX_WIDTH = 150;
            let MAX_HEIGHT = 150;
            let width = image.width;
            let height = image.height;
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(
                image,
                cropWidth, cropHeight,
                width, height);
            let dataurl = canvas.toDataURL(el.target.files[0].type);
            image.src = dataurl
        }, 100)
    }
    reader.readAsDataURL(el.target.files[0])
}
