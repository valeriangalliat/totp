# TOTP with a password manager that doesn't support TOTP 😅

> [See it live! 🐿](https://totp.vercel.app/)

## Overview

Some password managers, ahem, looking at you Lockwise, ahem, don't
support [TOTP](https://en.wikipedia.org/wiki/Time-based_One-Time_Password).

Or maybe you don't want to pay $10 per year for Bitwarden. Yes, you have
my permission to be that frugal. 💸

This usually requires falling back to an authenticator app like Authy or Google
Authenticator. Unless you like to swim against the current 🌊🏊 and you
want to "hack" your password manager to store TOTP secrets in it
somehow.

The cool app that you're looking at right now is making it easy for you
to "hack" your password manager in this way.

## How does it work?

Directly from the app, you can scan a QR code by using the device
camera, or upload/drop a screenshot of a QR code if that's more
convenient for you. If you already have a plaintext TOTP secret, you can
just paste it in the password field and submit the form.

This will trigger what will look to your password manager like a login
form submission, where only a password was submitted, so it will usually
prompt you to save the password for that website, including the option
to add an username.

I suggest putting a meaningful value as the username, to remember what
service this TOTP secret is for.

At that point, the app will generate a one-time password matching the
secret that was just added, and copy it to clipboard.

Now, because your password manager stored your TOTP secret like it's a
normal password for this website, anytime you come back to it (usually
when you need a one-time password) and focus the password field, it'll
happily autocomplete amongst all the saved TOTP secrets that you have
added in the past. Then you can click the big blue button and get your
one-time password copied to clipboard. 😋
