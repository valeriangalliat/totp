const QrScanner = require('qr-scanner')
const totp = require('totp-generator')

QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js'

const preview = document.getElementById('preview')
const previewVideo = preview.querySelector('video')
const form = document.getElementById('form')
const result = document.getElementById('result')
const resultCode = document.getElementById('code')
const { password, submit, scan, cancel } = form.elements

function generateCode () {
  const code = totp(password.value)
  result.classList.remove('is-hidden')
  result.style.lineHeight = `${resultCode.offsetHeight}px`
  resultCode.size = code.length - 2 // Not sure why but this fits perfectly.
  resultCode.value = code
  resultCode.select()
  navigator.clipboard.writeText(code)
}

form.addEventListener('submit', e => {
  e.preventDefault()
  generateCode()
})

password.addEventListener('change', () => {
  generateCode()
})

const qrScanner = new QrScanner(previewVideo, result => {
  scan.classList.remove('is-hidden')
  cancel.classList.add('is-hidden')
  preview.classList.add('is-hidden')
  qrScanner.stop()

  const secret = new URLSearchParams(new URL(result).search).get('secret')

  password.value = secret

  // Don't call `form.submit()` because it wouldn't trigger the event listener.
  submit.click()
})

// Force width to avoid pixel shift with rounding.
scan.style.width = `${scan.offsetWidth}px`

scan.addEventListener('click', e => {
  e.preventDefault()
  cancel.style.width = `${scan.offsetWidth}px`
  previewVideo.width = form.offsetWidth
  scan.classList.add('is-hidden')
  cancel.classList.remove('is-hidden')
  result.classList.add('is-hidden')
  preview.classList.remove('is-hidden')
  qrScanner.start()
})

cancel.addEventListener('click', e => {
  e.preventDefault()
  scan.classList.remove('is-hidden')
  cancel.classList.add('is-hidden')
  preview.classList.add('is-hidden')
  qrScanner.stop()
})

resultCode.addEventListener('click', e => {
  resultCode.select()
})
