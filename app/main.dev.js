/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, dialog, BrowserWindow } from 'electron';
import MenuBuilder from './menu';

let mainWindow = null;
let promptWindow = null;
let customURI

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
require('electron-debug')();
const path = require('path');
const p = path.join(__dirname, '..', 'app', 'node_modules');
require('module').globalPaths.push(p);
// }

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

const singleInstance = app.makeSingleInstance((argv, workingDirectory) => {
  if (process.platform == 'win32' || process.platform === 'linux') {
    customURI = argv.slice(1)
  }
  if (mainWindow) {
    createPrompt(false, customURI)
  }
})

if (singleInstance) {
  app.quit()
}

async function createWindow() {

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  if (process.platform === 'win32' || process.platform === 'linux') {
    customURI = process.argv.slice(1)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 970,
    height: 750
  });
  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
    createPrompt(false, customURI)
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    promptWindow = null;
    app.quit();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
};

async function createPrompt(event, url) {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  if(event) event.preventDefault()
  customURI = url
  var parse = require('url-parse');
  promptWindow = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    width: 500,
    height: 600
  });
  const parsed = parse(url, true)
  parsed.query.type = parsed.hostname
  parsed.query.action = 'promptOperation'
  promptWindow.webContents.on('did-finish-load', () => {
    if (!promptWindow) {
      throw new Error('"promptWindow" is not defined');
    }
    promptWindow.show();
    promptWindow.focus();
  })
  if(parsed.host === 'sign') {
    const exp = /\/tx\/((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)/;
    const match = exp.exec(parsed.pathname);
    const base64encoded = match[1];
    const metaexp = /^#((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/
    const metamatch = metaexp.exec(parsed.hash)
    let base64encodedmeta = 'e30='
    if(metamatch) {
      base64encodedmeta = metamatch[1]
    }
    promptWindow.loadURL(`file://${__dirname}/app.html?type=sign&action=promptOperation&ops=${base64encoded}&meta=${base64encodedmeta}`);
  }
}

app.setAsDefaultProtocolClient('steem')
app.on('ready', createWindow)
app.on('open-url', createPrompt)
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  mainWindow = null;
  promptWindow = null;
});


function devToolsLog(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}
