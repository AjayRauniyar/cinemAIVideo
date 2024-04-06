document.getElementById('generateForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
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
  });
  