const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
const path = require('path');
const url = require('url');

require('dotenv').config();

const sourcesDirectory = path.join(__dirname, 'src');
const assetsDirectory = path.join(sourcesDirectory, 'assets');

// live reload for electrion
require('electron-reload')(path.join(sourcesDirectory), {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let tray = undefined;
let window = undefined;

// Don't show the app in the doc
// app.dock.hide();

app.on('ready', () => {
  createTray();
  createWindow()
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
});

let keepVisible = false;

const changeVisibility = () => {
  keepVisible = !keepVisible;

}

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'images/lizard.png'))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', click() {
        toggleWindow();
      }
    },
    {
      label: 'Keep Visible',
      type: 'checkbox',
      checked: keepVisible,
      click() {
        changeVisibility()
        tray.setContextMenu(contextMenu)
      }
    },
    {
      type: 'separator'
    },
    {label: 'Exit', click() { app.quit() } }
  ])
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', function (event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })
  tray.setToolTip('Lizard');
  tray.setContextMenu(contextMenu)
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x: x, y: y}
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 400,
    height: 550,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: true,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });
  window.loadURL('http://localhost:4200');

  if ('true' === process.env.PACKAGE) {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  } else {
    window.loadURL(process.env.HOST);
    //window.webContents.openDevTools();
    toggleWindow();
  }

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      if (!keepVisible) {
        window.hide()
      }
      ///
    }
  })
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus()
};

ipcMain.on('show-window', () => {
  showWindow()
});

ipcMain.on('ipc-updated', (event, data) => {
  //
});
