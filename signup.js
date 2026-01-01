const firstNameInput = document.getElementById('firstNameInput')
const lastNameInput = document.getElementById('lastNameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')
const signUpInput = document.getElementById('signUpInput')

let userData = {}

firstNameInput.addEventListener('input', (e) => {
  userData.firstname = e.target.value
})

lastNameInput.addEventListener('input', (e) => {
  userData.lastname = e.target.value
})

emailInput.addEventListener('input', (e) => {
  userData.email = e.target.value
})

passwordInput.addEventListener('input', (e) => {
  userData.password = e.target.value
})

const getAccessToken = async () => {
  try {

    console.log("Sending to server:", JSON.stringify(userData))

    const res = await fetch('https://ilkinibadov.com/api/b/auth/refresh', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password
      })
    })

    if (!res.ok) {
      throw new Error("There was a problem getting the token.")
    }

    const data = await res.json()
    console.log("Access token:", data.accessToken)

    localStorage.setItem("accessToken", data.accessToken)
    sessionStorage.setItem("accessToken", data.accessToken)

  } catch (error) {
    console.error(error.message)
  }
}

const signUpRequest = async () => {
  try {
    const res = await fetch('https://ilkinibadov.com/api/b/auth/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })

    if (!res.ok) {
      throw new Error("Registration failed")
    }

    const data = await res.json()
    console.log("Register success:", data)

    const token = data.token || data.accessToken || data.access_token || data.data?.token
    const refreshToken = data.refreshToken || data.refresh_token || data.data?.refreshToken

    if (token) {

      localStorage.setItem("accessToken", token)
      sessionStorage.setItem("accessToken", token)
      console.log("Access token saved:", token)

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken)
        sessionStorage.setItem("refreshToken", refreshToken)
        console.log("Refresh token saved:", refreshToken)
      }

      alert("Registration successful!")
      window.location.href = "http://127.0.0.1:5500/index.html"
    } else {

      await getAccessToken()
      window.location.href = "http://127.0.0.1:5500/index.html"
    }

  } catch (error) {
    alert(error.message)
    console.error(error.message)
  }
}

signUpInput.addEventListener("click", (e) => {
  e.preventDefault()
  console.log("Register click, userData:", userData)
  signUpRequest()
})