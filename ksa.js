// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const refreshBtn = document.getElementById('refresh-btn');
// const colorPicker = document.getElementById('color-picker');

// canvas.width = 400; // Set canvas width
// canvas.height = 400; // Set canvas height

// let selectedColor = colorPicker.value;

// // Function to load a random black and white image
// const loadRandomImage = () => {
//     const randomImageIndex = Math.floor(Math.random() * 10) + 1; // Change 10 to the number of images available
//     const img = new Image();
//     img.src = `https://picsum.photos/400/400?grayscale&random=${randomImageIndex}`;
//     img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image on canvas
//     };
// };

// // Load initial random image
// loadRandomImage();

// // Event listener to refresh the image
// refreshBtn.addEventListener('click', loadRandomImage);

// // Flood fill function
// const floodFill = (x, y, targetColor, replacementColor) => {
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     const width = imageData.width;
//     const height = imageData.height;

//     const stack = [[x, y]];

//     const getPixelIndex = (x, y) => (y * width + x) * 4;

//     const targetR = targetColor[0];
//     const targetG = targetColor[1];
//     const targetB = targetColor[2];

//     while (stack.length) {
//         const [curX, curY] = stack.pop();
//         const pixelIndex = getPixelIndex(curX, curY);
//         const r = data[pixelIndex];
//         const g = data[pixelIndex + 1];
//         const b = data[pixelIndex + 2];

//         if (r === targetR && g === targetG && b === targetB) {
//             data[pixelIndex] = replacementColor[0];
//             data[pixelIndex + 1] = replacementColor[1];
//             data[pixelIndex + 2] = replacementColor[2];

//             if (curX > 0) stack.push([curX - 1, curY]);
//             if (curX < width - 1) stack.push([curX + 1, curY]);
//             if (curY > 0) stack.push([curX, curY - 1]);
//             if (curY < height - 1) stack.push([curX, curY + 1]);
//         }
//     }

//     ctx.putImageData(imageData, 0, 0);
// };

// // Event listener for canvas click to fill color
// canvas.addEventListener('click', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = Math.floor(e.clientX - rect.left);
//     const y = Math.floor(e.clientY - rect.top);

//     const imageData = ctx.getImageData(x, y, 1, 1);
//     const targetColor = [imageData.data[0], imageData.data[1], imageData.data[2]];
//     const replacementColor = hexToRgb(selectedColor);

//     floodFill(x, y, targetColor, replacementColor);
// });

// // Function to convert hex color to RGB
// const hexToRgb = (hex) => {
//     const bigint = parseInt(hex.replace('#', ''), 16);
//     const r = (bigint >> 16) & 255;
//     const g = (bigint >> 8) & 255;
//     const b = bigint & 255;
//     return [r, g, b];
// };

// // Event listener for color picker
// colorPicker.addEventListener('input', (e) => {
//     selectedColor = e.target.value; // Update the selected color
// });
