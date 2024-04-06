let modelLoaded = false;
let formSubmitted = false; // Flag to track whether form has been submitted

async function loadModel() {
  // Load the model and its dependencies if not already loaded
  if (!modelLoaded) {
    // Display loading message
    console.log('Loading model...');

    // Load the model (example)
    // Replace this with your actual model loading code
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time

    // Set modelLoaded to true once the model is loaded
    modelLoaded = true;

    // Log message indicating model is loaded
    console.log('Model loaded.');
  }
}

document.getElementById('generateForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Check if form has already been submitted
  if (formSubmitted) {
    return; // Exit the event handler if form has already been submitted
  }
  
  // Mark the form as submitted
  formSubmitted = true;
  
  // Load the model before generating the GIF, only if it's not already loaded
  await loadModel();

  // Check if model is already loaded, to avoid running it twice
  if (modelLoaded) {
    const prompt = document.getElementById('prompt').value;
    const response = await fetch('/generate-gif', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `prompt=${encodeURIComponent(prompt)}`
    });

    if (response.ok) {
      document.getElementById('generatedGIF').src = 'animatelcm.gif';
    } else {
      alert('Error generating GIF');
    }
  }
});
