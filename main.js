process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
const electron= require("electron")
const {app, BrowserWindow, screen, shell} = electron;
const path = require('path')
const isdev = !app.isPackaged
const { ipcMain } = require('electron');
const Store = require('electron-store');
const fs = require('fs');
const store = new Store();

ipcMain.on('save-user', (event, user) => {
    const data = {
        accessToken: user.accessToken,
        user: user.user, 
    };
    store.set('userData', JSON.stringify(data));
});

ipcMain.on('get-user', (event) => {
    const userData = store.get('userData');
    if (userData) {
        event.returnValue = JSON.parse(userData);
    } else {
        event.returnValue = null;
    }
});

ipcMain.handle('clear-user', async (event) => {
    try {
        await store.clear();
        console.log("user model cleared");
    } catch (error) {
        console.error("Failed to clear user model:", error);
    }
});


function createWindow(){
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
   const win = new BrowserWindow({
        width:width,
        height:height,
        webPreferences:{

            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
           // preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, './src/assets/images/icon.png')
    })

    win.loadFile(path.join(__dirname, 'public', 'index.html'))

    const colorsFilePath = path.join(__dirname, 'src', 'assets', 'theme', 'base','colors.js');
     
  
    fs.watchFile(colorsFilePath, (curr, prev) => {

        try {
            const colors = JSON.parse(fs.readFileSync(colorsFilePath, 'utf8'));
            win.webContents.send('update-colors', colors);
        } catch (error) {
            console.error('Error reading or parsing colors.json:', error);
        }
    });

}
if(isdev){
    require('electron-reload')(__dirname, {
        electron:path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
}
app.whenReady().then(createWindow)

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length == 0){
        createWindow();
    }
})

app.on('web-contents-created', (_, contents) => {
    contents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  });

