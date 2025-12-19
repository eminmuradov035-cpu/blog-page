const darkModeBtn = document.getElementById("darkModeBtn")
const blogCarts = document.getElementById("blogCarts")
const loadMoreBtn = document.getElementById("loadMoreBtn")

async function name(params) {
  
}

darkModeBtn.addEventListener("click", () => {

  const darkmode = localStorage.getItem("darkmode")
  localStorage.setItem("darkmode", darkmode === "light" ? "dark" : "light")

  const currentMode = localStorage.getItem("darkmode")
  console.log(currentMode);

  const body = document.getElementById("body")

  if (currentMode === "light") {
    body.classList.remove("bg-slate-900", "text-white")
    body.classList.add("bg-white", "text-black")
  } else {
    body.classList.remove("bg-white", "text-black")
    body.classList.add("bg-slate-900", "text-white")
  }

})

window.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("darkmode") || "light"
  
    const body = document.getElementById("body")
  
    if (savedMode === "light") {
      body.classList.remove("bg-slate-900", "text-white")
      body.classList.add("bg-white", "text-black")
    } else {
      body.classList.remove("bg-white", "text-black")
      body.classList.add("bg-slate-900", "text-white")
    }
  })