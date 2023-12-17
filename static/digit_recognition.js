let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let predictionDiv = document.getElementById('prediction');
let isDrawing = false;

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);



function handleMouseDown(e) {
  isDrawing = true;
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  ctx.beginPath();
  ctx.moveTo(x, y);
}




function handleMouseMove(e) {
  if (isDrawing) { // Check if the mouse button is pressed
    isCanvasCleared = false; // Set flag to false when drawing starts
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
}}





function handleMouseUp() {
  isDrawing = false;
  ctx.beginPath();
}




function drawDottedLines() {
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 0.5; // Set line width to default
  ctx.strokeStyle = 'black';

  // Calculate the distance to extend from the corners (20% of the edge length)
  const extensionLength = 0.04 * Math.min(canvas.width, canvas.height);

  // Draw dotted lines at each corner extending 20% of the edge length
  ctx.beginPath();

  // Top-left corner
  ctx.moveTo(40, 40);
  ctx.lineTo(40 + extensionLength, 40);
  ctx.moveTo(40, 40);
  ctx.lineTo(40, 40 + extensionLength);

  // Top-right corner
  ctx.moveTo(canvas.width - 40, 40);
  ctx.lineTo(canvas.width - 40 - extensionLength, 40);
  ctx.moveTo(canvas.width - 40, 40);
  ctx.lineTo(canvas.width - 40, 40 + extensionLength);

  // Bottom-left corner
  ctx.moveTo(40, canvas.height - 40);
  ctx.lineTo(40 + extensionLength, canvas.height - 40);
  ctx.moveTo(40, canvas.height - 40);
  ctx.lineTo(40, canvas.height - 40 - extensionLength);

  // Bottom-right corner
  ctx.moveTo(canvas.width - 40, canvas.height - 40);
  ctx.lineTo(canvas.width - 40 - extensionLength, canvas.height - 40);
  ctx.moveTo(canvas.width - 40, canvas.height - 40);
  ctx.lineTo(canvas.width - 40, canvas.height - 40 - extensionLength);

  ctx.stroke();
}

drawDottedLines();









// Function to display a message
function displayMessage(message) {
  let existingMessage = document.querySelector('.message');
  
  if (existingMessage) {
    existingMessage.textContent = message;
    existingMessage.style.display = 'block'; // Ensure the message is visible
  } else {
    const messageDisplay = document.createElement('div');
    messageDisplay.textContent = message;
    messageDisplay.classList.add('message');
    document.body.appendChild(messageDisplay);
  }
}



// Function to remove a message
function removeMessage() {
  let message = document.querySelector('.message');
  if (message) {
    message.remove(); // Remove the message element entirely
  }
}




function fadeInMessage(messageText) {
  let existingMessage = document.querySelector('.message');
  
  if (!existingMessage) {
    const messageDisplay = document.createElement('div');
    messageDisplay.textContent = messageText;
    messageDisplay.classList.add('message');
    document.body.appendChild(messageDisplay);
    existingMessage = messageDisplay;
  } else {
    existingMessage.textContent = messageText;
  }




  // Fade-in effect
  existingMessage.style.opacity = '0';
  let opacity = 0;
  const duration = 1000; // Adjust the duration of the animation (in milliseconds)
  const intervalTime = 50; // Time interval for animation change (in milliseconds)

  const fadeInInterval = setInterval(() => {
    opacity += intervalTime / duration;
    existingMessage.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(fadeInInterval);
    }
  }, intervalTime);
}





function predictDigit() {
  // Check if the canvas is empty (no drawn content except for the dotted lines area)
  let guideAreaData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Set flag to false when predictDigit is executed
  messageDisplayed = false;

  // Count non-transparent pixels within the guide area
  let nonTransparentCount = 0;
  for (let i = 0; i < guideAreaData.length; i += 4) {
    if (guideAreaData[i + 3] !== 0) {
      nonTransparentCount++;
    }
  }

  // Calculate the percentage of non-transparent pixels
  let nonTransparentPercentage = (nonTransparentCount / ((canvas.width) * (canvas.height))) * 100;
  console.log('Non-transparent Pixel Percentage:', nonTransparentPercentage); // Debug statement


  // If the canvas is empty , display a message and don't make a prediction request
  if (nonTransparentPercentage <= 0.24) { // Adjust the threshold as needed
    console.log('canvas is blank'); // Debug statement
    fadeInMessage('Before making a prediction, please draw something on the canvas as it appears blank at the moment');
    return;
  }

  // If something non significant is drawn , display a message and don't make a prediction request
  if (nonTransparentPercentage < 3 && nonTransparentPercentage > 0.24) {
    console.log('Some content present but not sufficient.'); // Debug statement
    fadeInMessage('Please draw something more substantial.');
    return;
}


  // Remove the message element if it exists
  removeMessage();

  // If content is drawn, proceed with prediction
  let imageData = canvas.toDataURL();



  fetch('/predict', {
    method: 'POST',
    body: JSON.stringify({ image_data: imageData }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(prediction => {
    document.getElementById('prediction').innerText = `Predicted Digit: ${prediction}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}





let isCanvasCleared = true; // Initialize as true since the canvas starts clear

function clearCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Check if the canvas is already clear
  if (isCanvasCleared) {
    fadeInMessage('Canvas is already clear, please start drawing a digit');
    return;
  }

  // Clear the canvas
  fadeInMessage('Canvas cleared. For optimal prediction, Maximize the drawn digit coverage strictly within the designated boundaries.');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the dotted lines 
  drawDottedLines();

  // Clear the displayed prediction
  document.getElementById('prediction').innerText = '';

  isCanvasCleared = true; // Set flag to true after clearing the canvas
}



