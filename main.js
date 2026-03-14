const { app, BrowserWindow,Menu  } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  Menu.setApplicationMenu(null);
  // Load the Angular build output
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/hotel-dashboard/index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});