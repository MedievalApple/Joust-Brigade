export const canvas = <HTMLCanvasElement>document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
if (ctx) {
    ctx.imageSmoothingEnabled = false;
}
