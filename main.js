const QrScanner = require('qr-scanner')
const totp = require('totp-generator')
const dragDrop = require('drag-drop')

QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js'

const preview = document.getElementById('preview')
const previewVideo = preview.querySelector('video')
const form = document.getElementById('form')
const result = document.getElementById('result')
const resultCode = document.getElementById('code')
const dropzone = document.getElementById('dropzone')
const { password, submit, scanCode, scanImage, file, cancel } = form.elements

function generateCode () {
  const code = totp(password.value)
  result.classList.remove('is-hidden')
  result.style.lineHeight = `${resultCode.offsetHeight}px`
  resultCode.size = code.length - 2 // Not sure why but this fits perfectly.
  resultCode.value = code
  resultCode.select()
  navigator.clipboard.writeText(code)
}

function handleTotpUrl (url) {
  const secret = new URLSearchParams(new URL(url).search).get('secret')

  password.value = secret

  // Don't call `form.submit()` because it wouldn't trigger the event listener.
  submit.click()
}

async function handleFile (file) {
  handleTotpUrl(await QrScanner.scanImage(file))
}

form.addEventListener('submit', e => {
  e.preventDefault()
  generateCode()
})

password.addEventListener('change', () => {
  generateCode()
})

const qrScanner = new QrScanner(previewVideo, result => {
  scanCode.classList.remove('is-hidden')
  cancel.classList.add('is-hidden')
  preview.classList.add('is-hidden')
  qrScanner.stop()
  handleTotpUrl(result)
})

// Force width to avoid pixel shift with rounding.
scanCode.style.width = `${scanCode.offsetWidth}px`

scanCode.addEventListener('click', e => {
  e.preventDefault()
  cancel.style.width = `${scanCode.offsetWidth}px`
  previewVideo.width = form.offsetWidth
  scanCode.classList.add('is-hidden')
  cancel.classList.remove('is-hidden')
  result.classList.add('is-hidden')
  preview.classList.remove('is-hidden')
  qrScanner.start()
})

scanImage.addEventListener('click', e => {
  e.preventDefault()
  file.click()
})

file.addEventListener('change', () => {
  handleFile(file.files[0])
})

cancel.addEventListener('click', e => {
  e.preventDefault()
  scanCode.classList.remove('is-hidden')
  cancel.classList.add('is-hidden')
  preview.classList.add('is-hidden')
  qrScanner.stop()
})

resultCode.addEventListener('click', e => {
  resultCode.select()
})

dragDrop('body', {
  onDrop (files) {
    handleFile(files[0])
  },
  onDragEnter (event) {
    dropzone.classList.remove('is-hidden')
  },
  onDragLeave (event) {
    dropzone.classList.add('is-hidden')
  }
})
