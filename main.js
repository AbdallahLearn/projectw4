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

const imageCanvas = document.createElement('canvas');
const imageCtx = imageCanvas.getContext("2d");

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

fillBtn.addEventListener("click", () => {
    isFilling = !isFilling; 
    fillBtn.classList.toggle("active", isFilling); 
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

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: Math.floor((clientX - rect.left) * scaleX),
        y: Math.floor((clientY - rect.top) * scaleY)
    };
};

const loadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const drawingBoard = document.querySelector('.drawing-board');

            // Set the background image for the drawing board
            drawingBoard.style.backgroundImage = `url(${e.target.result})`;
            drawingBoard.style.backgroundSize = 'cover'; // Cover the entire drawing board
            drawingBoard.style.backgroundPosition = 'center'; // Center the image

            // Set the canvas size to match the drawing board
            const drawingBoardWidth = drawingBoard.clientWidth;
            const drawingBoardHeight = drawingBoard.clientHeight;
            canvas.width = drawingBoardWidth;
            canvas.height = drawingBoardHeight;

            // Draw the loaded image onto the canvas
            // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            removeImageBtn.style.display = "block"; 
        };
        img.src = e.target.result; 
    };

    if (file) {
        reader.readAsDataURL(file);
    }
};

const removeImage = () => {
    const drawingBoard = document.querySelector('.drawing-board');
    drawingBoard.style.backgroundImage = 'none'; 
    imageInput.value = ""; 
    removeImageBtn.style.display = "none"; 
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
    const dataURL = canvas.toDataURL('image/png');
    
    const data = {
        username: username.value,
        url: [dataURL] 
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Success:', data); 
    })
    .catch(error => {
        console.error('Error:', error); 
    });

    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = dataURL; 
    setCanvasBackground(); 
    link.click(); 
});


imageInput.addEventListener('change', loadImage);
removeImageBtn.addEventListener('click', removeImage); 


canvas.addEventListener("mousedown", startDraw); 
canvas.addEventListener("mousemove", drawing); 
canvas.addEventListener("mouseup", () => isDrawing = false); 


canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", drawing);
canvas.addEventListener("touchend", () => isDrawing = false);

let usernameValue = localStorage.getItem('Username');
console.log(usernameValue);

let username = document.querySelector('#username');
username.textContent = ` ${usernameValue}`;

function logout() {
    window.location.href = 'login.html';
}

const url = 'https://670bfff17e5a228ec1cf44f8.mockapi.io/users'; // Ensure this is the correct endpoint for image uploads
const uploadImg = document.querySelector('#upload-img');

imageInput.addEventListener('change', e => {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        console.log(reader.result);
    });
    reader.readAsDataURL(file);
});

uploadImg.addEventListener('click', function() {
    const file = imageInput.files[0]; 

    if (!file) {
        alert('Please select an image file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file); 

    
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data); 
    })
    .catch(error => {
        console.error('Error:', error); 
    });
});
