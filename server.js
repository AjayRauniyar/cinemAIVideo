const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle generating GIF
app.post('/generate-gif', (req, res) => {
  const prompt = req.body.prompt;

  // Execute Python script to generate GIF
  const pythonProcess = spawn('python', ['generate_gif.py', prompt]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      // Move the generated GIF to the public directory
      fs.renameSync(path.join(__dirname, 'animatelcm.gif'), path.join(__dirname, 'public', 'animatelcm.gif'));
      res.sendFile(path.join(__dirname, 'public', 'animatelcm.gif'));
    } else {
      res.status(500).send('Error generating GIF');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
