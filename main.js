const QrScanner = require('qr-scanner')
const totp = require('totp-generator')
const dragDrop = require('drag-drop')

QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js'

const preview = document.getElementById('preview')
const previewVideo = preview.querySelector('video')
const form = document.getElementById('form')
const formDetails = document.getElementById('form-details')
const result = document.getElementById('result')
const error = document.getElementById('error')
const resultCode = document.getElementById('code')
const dropzone = document.getElementById('dropzone')
const { username, password, scanCode, scanImage, showDetails, file, cancel } = form.elements
const { secret, algorithm, digits, period, authyMode, resetDefaults } = formDetails.elements

function updatePasswordFromDetails () {
  if (!password.value.startsWith('otpauth://')) {
    const search = new URLSearchParams()
    search.set('secret', secret.value)
    search.set('algorithm', algorithm.value)
    search.set('digits', digits.value)
    search.set('period', period.value)

    password.value = `otpauth://totp/${username.value}?${search}`
    return
  }

  const url = new URL(password.value)
  const search = new URLSearchParams(url.search)

  search.set('secret', secret.value)
  search.set('algorithm', algorithm.value)
  search.set('digits', digits.value)
  search.set('period', period.value)

  url.search = search
  password.value = url.toString()
}

function updateDetailsFromPassword () {
  if (!password.value.startsWith('otpauth://')) {
    secret.value = password.value
    algorithm.value = 'SHA-1'
    digits.value = 6
    period.value = 30
    return
  }

  const search = new URLSearchParams(new URL(password.value).search)

  secret.value = search.get('secret')
  algorithm.value = search.get('algorithm') || 'SHA-1'
  digits.value = search.get('digits') || 6
  period.value = search.get('period') || 30
}

function totpFromUrlOrSecret (value) {
  if (!value.startsWith('otpauth://')) {
    // Directly the secret, use default options.
    return totp(value)
  }

  const search = new URLSearchParams(new URL(value).search)
  const { secret, algorithm, digits, period } = Object.fromEntries(search)

  return totp(secret, { algorithm, digits, period })
}

function generateCode () {
  const code = totpFromUrlOrSecret(password.value)
  result.classList.remove('is-hidden')
  result.style.lineHeight = `${resultCode.offsetHeight}px`
  resultCode.size = code.length - 2 // Not sure why but this fits perfectly.
  resultCode.value = code
  resultCode.select()
  navigator.clipboard.writeText(code)
}

function handleTotpUrl (url) {
  const search = new URLSearchParams(new URL(url).search)

  username.value = search.get('issuer')
  password.value = url
  updateDetailsFromPassword()
}

function handleFile (file) {
  QrScanner.scanImage(file)
    .then(result => {
      error.classList.add('is-hidden')
      handleTotpUrl(result)
    })
    .catch(err => {
      console.error(err)
      result.classList.add('is-hidden')
      error.classList.remove('is-hidden')
    })
}

form.addEventListener('submit', e => {
  e.preventDefault()
  generateCode()
})

const qrScanner = new QrScanner(previewVideo, result => {
  scanCode.classList.remove('is-hidden')
  cancel.classList.add('is-hidden')
  preview.classList.add('is-hidden')
  error.classList.add('is-hidden')
  qrScanner.stop()
  handleTotpUrl(result)
})

// Force width to avoid pixel shift with rounding.
scanCode.style.width = `${scanCode.offsetWidth}px`

password.addEventListener('change', updateDetailsFromPassword)

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

showDetails.addEventListener('click', e => {
  e.preventDefault()
  updateDetailsFromPassword()
  formDetails.classList.toggle('is-hidden')
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

secret.addEventListener('change', updatePasswordFromDetails)
algorithm.addEventListener('change', updatePasswordFromDetails)
digits.addEventListener('change', updatePasswordFromDetails)
period.addEventListener('change', updatePasswordFromDetails)

authyMode.addEventListener('click', e => {
  algorithm.value = 'SHA-1'
  digits.value = 7
  period.value = 10
  updatePasswordFromDetails()
})

resetDefaults.addEventListener('click', e => {
  algorithm.value = 'SHA-1'
  digits.value = 6
  period.value = 30
  updatePasswordFromDetails()
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
