// electron/main.ts
import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Загрузка локального сервера Vite
  mainWindow.loadURL('http://localhost:5173')

  // Или загрузка production build'а (после сборки)
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, '../dist/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})