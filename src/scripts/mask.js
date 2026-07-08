const spriteInput = document.getElementById("spriteInput");
const maskInput = document.getElementById("maskInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let spriteImg = null;
let maskImg = null;

function loadImage(file, cb) {
    const img = new Image();
    img.onload = () => cb(img);
    img.src = URL.createObjectURL(file);
}

spriteInput.addEventListener("change", (e) => {
    loadImage(e.target.files[0], (img) => (spriteImg = img));
});

maskInput.addEventListener("change", (e) => {
    loadImage(e.target.files[0], (img) => (maskImg = img));
});

document.getElementById("process").addEventListener("click", () => {
    if (!spriteImg || !maskImg) return;

    const w = spriteImg.width;
    const h = spriteImg.height;

    canvas.width = w;
    canvas.height = h;

    // draw sprite
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(spriteImg, 0, 0);

    const spriteData = ctx.getImageData(0, 0, w, h);

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.drawImage(maskImg, 0, 0);

    const maskData = maskCtx.getImageData(0, 0, w, h).data;
    const data = spriteData.data;

    // apply mask
    for (let i = 0; i < data.length; i += 4) {
        const maskValue = maskData[i]; // red channel (0–255)
        data[i + 3] = maskValue; // alpha
    }

    ctx.putImageData(spriteData, 0, 0);
});

document.getElementById("download").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "masked-sprite.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
