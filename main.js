const canvas = document.querySelector('canvas'),
      toolsBtns = document.querySelectorAll('.tool'),
      fillColor = document.querySelector('#fill-color'),
      sizeSlider = document.querySelector("#size-slider"),
      colorsBtns = document.querySelectorAll(".colors .option"),
      colorPicker = document.querySelector("#color-picker"),
      clearCanvas = document.querySelector(".clear-canvas"),
      saveBtn = document.querySelector('.save-img'),
      imageInput = document.querySelector("#image-input"),
      removeImageBtn = document.querySelector("#remove-img"),
      fillBtn = document.querySelector("#fill"),
      ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot, 
    isDrawing = false,
    selectedTool = 'brush',
    brushWidth = 5,
    isFilling = false,
    imageLoaded = false,
    selectColor = "#000";

// const img = new Image();
const imageCanvas = document.createElement('canvas');
const imageCtx = imageCanvas.getContext("2d");

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

fillBtn.addEventListener("click", () => {
    isFilling = !isFilling; // Toggle filling mode
    fillBtn.classList.toggle("active", isFilling); // Optional: style change
});

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;  
    setCanvasBackground();
});

// Function to get mouse/touch position
const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: Math.floor(clientX - rect.left * (canvas.width / rect.width)),
        y: Math.floor(clientY - rect.top * (canvas.height / rect.height))
    };
};

// Load image onto off-screen canvas
const loadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            imageCanvas.width = canvas.width;
            imageCanvas.height = canvas.height;
            imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); // Clear any existing image
            imageCtx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image to the off-screen canvas
            ctx.drawImage(imageCanvas, 0, 0); // Draw image on the main canvas
            imageLoaded = true;
        };
        img.src = e.target.result;
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
    
    removeImageBtn.style.display = "block";
};

const removeImage = () => {
    if (imageLoaded) {
        // Clear the off-screen canvas without affecting the main canvas
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); // Clear the off-screen canvas
        setCanvasBackground();
        imageLoaded = false; // Reset flag
        removeImageBtn.style.display = "none";
    }
};

const drawLine = (e) => {
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = selectColor;
    ctx.stroke();
};

const drawRect = (e) => {
    const { x, y } = getMousePos(e);
    ctx.fillStyle = fillColor.checked ? selectColor : ctx.strokeStyle;
    if (!fillColor.checked) {
        return ctx.strokeRect(x, y, prevMouseX - x, prevMouseY - y);
    }
    ctx.fillRect(x, y, prevMouseX - x, prevMouseY - y);
};

const drawCircle = (e) => {
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - x), 2) + Math.pow((prevMouseY - y), 2));
    ctx.fillStyle = fillColor.checked ? selectColor : ctx.strokeStyle;
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(x, y);
    ctx.lineTo(prevMouseX * 2 - x, y);
    ctx.closePath();
    ctx.fillStyle = fillColor.checked ? selectColor : ctx.strokeStyle;
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
    isDrawing = true;
    e.preventDefault();
    
    const pos = getMousePos(e);
    prevMouseX = pos.x; 
    prevMouseY = pos.y; 
    
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectColor;
    ctx.fillColor = selectColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
    if (!isDrawing) return;

    e.preventDefault();
    ctx.putImageData(snapshot, 0, 0);
    
    const pos = getMousePos(e);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "line") {
        drawLine(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
};

toolsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active'); 
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);

colorsBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected'); 
        selectColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    });
});

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    selectColor = colorPicker.value; // Update the selectColor to match the color picker value
});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveBtn.addEventListener('click', () => {
    
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    setCanvasBackground();
    link.click();
});

// New input for image upload
imageInput.addEventListener('change', loadImage);
removeImageBtn.addEventListener('click', removeImage); // Add event listener for remove image button

// Event listeners for mouse
canvas.addEventListener("mousedown", startDraw); 
canvas.addEventListener("mousemove", drawing); 
canvas.addEventListener("mouseup", () => isDrawing = false); 

// Event listeners for touch
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", drawing);
canvas.addEventListener("touchend", () => isDrawing = false);


function login(){
    window.location.href = 'login.html'
}
function signup(){
     window.location.href = 'signup.html'
}