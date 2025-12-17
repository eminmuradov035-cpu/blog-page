const signInInput = document.getElementById('signInInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')

let userData = {}

emailInput.addEventListener('input', (e) => {
  userData = {
    ...userData,
    email: e.target.value
  }
})

passwordInput.addEventListener('input', (e) => {
  userData = {
    ...userData,
    password: e.target.value
  }
})

signInInput.addEventListener("click", () => {
    console.log(userData);
})
