const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');

app.setName('Federal Electric');

// Portable Linux alphas must launch without requiring root-owned chrome-sandbox setup.
// Store/release packaging can restore the OS sandbox once installer/depot ownership is controlled.
if (process.platform === 'linux' && app.isPackaged) {
  app.commandLine.appendSwitch('no-sandbox');
}

const APP_ROOT = path.resolve(__dirname, '..');
const SMOKE_TEST = process.argv.includes('--smoke-test');

function isInsideApp(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'file:') return false;
    const target = path.resolve(fileURLToPath(url));
    return target === APP_ROOT || target.startsWith(APP_ROOT + path.sep);
  } catch (e) {
    return false;
  }
}

function secureWebContents(contents) {
  contents.setWindowOpenHandler(({ url }) => {
    if (isInsideApp(url)) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
          backgroundColor: '#111111',
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
          }
        }
      };
    }

    if (/^https?:\/\//i.test(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  contents.on('will-navigate', (event, url) => {
    if (isInsideApp(url)) return;
    event.preventDefault();
    if (/^https?:\/\//i.test(url)) {
      void shell.openExternal(url);
    }
  });
}

app.on('web-contents-created', (_event, contents) => {
  secureWebContents(contents);
});

function createMainWindow() {
  const win = new BrowserWindow({
    title: 'Federal Electric',
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#111111',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once('ready-to-show', () => {
    if (!SMOKE_TEST) win.show();
  });

  win.webContents.once('did-finish-load', () => {
    if (SMOKE_TEST) {
      console.log('FEDERAL_ELECTRIC_SMOKE_OK');
      setTimeout(() => app.quit(), 500);
    }
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, _validatedURL, isMainFrame) => {
    if (SMOKE_TEST && isMainFrame) {
      console.error('FEDERAL_ELECTRIC_SMOKE_FAIL', errorCode, errorDescription);
      app.exit(1);
    }
  });

  void win.loadFile(path.join(APP_ROOT, 'index.html')).catch((error) => {
    console.error('FEDERAL_ELECTRIC_LOAD_FAIL', error);
    if (SMOKE_TEST) app.exit(1);
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
