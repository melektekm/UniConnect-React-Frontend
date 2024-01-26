const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // Ensure nodeIntegration is set to false
      contextIsolation: true, // Enable context isolation
      preload: path.join(__dirname, 'preload.js'), // Path to your preload script if you need to use any specific functionality in the renderer process
    }
  });

  // Load your HTML file or URL into the mainWindow
});
