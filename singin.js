const signInInput = document.getElementById('signInInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')

let userData = {}

const signInRequest = async () => {
  try {
    const res = await fetch("https://ilkinibadov.com/api/b/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })

    if (!res.ok) {
      throw new Error("Email or password incorrect")
    }

    const data = await res.json()
    console.log("Login passed:", data)

    const token = data.token || data.accessToken || data.access_token || data.data?.token

    if (token) {
      localStorage.setItem("accessToken", token)
      console.log("Token saved to localStorage:", token)
      
      alert("Login successful!")
      window.location.href = "http://127.0.0.1:5500/index.html"
    } else {
      console.error("Token not found in response:", data)
      alert("Login successful but token not received")
    }

  } catch (error) {
    alert("Email or password is incorrect!")
    console.error(error.message)
  }
}


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
  signInRequest()
})