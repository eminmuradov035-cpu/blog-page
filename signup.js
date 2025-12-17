const nameInput = document.getElementById('nameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')
const confrimPasswordInput = document.getElementById('confrimPasswordInput')
const signUpInput = document.getElementById('signUpInput')

let userData = []

nameInput.addEventListener('input', (e) => {
    userData = {
        ...userData,
        name: e.target.value
    }
})

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

confrimPasswordInput.addEventListener('input', (e) => {
    userData = {
        ...userData,
        password: e.target.value
    }
})

signUpInput.addEventListener("click", () => {
    console.log(userData);
})
