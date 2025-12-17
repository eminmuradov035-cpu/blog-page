const darkModeBtn = document.getElementById("darkModeBtn")
const addTitleForBlog = document.getElementById('addTitleForBlog')
const selectCategory = document.getElementById('selectCategory')
const addThumbnailimgage = document.getElementById('addThumbnailimgage')
const addBlogBody = document.getElementById('addBlogBody')
const submitBtn = document.getElementById('submitBtn')

let userData = []

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

addTitleForBlog.addEventListener('input', (e) => {
  userData = {
    ...userData,
    titleBlog: e.target.value
  }
})

selectCategory.addEventListener('input', (e) => {
  userData = {
    ...userData, 
    Categoty: e.target.value
  }
})

addThumbnailimgage.addEventListener('input', (e) => {
  userData = {
    ...userData,
    thumbnail: e.target.value
  }
})

addBlogBody.addEventListener('input', (e) => {
  userData = {
    ...userData,
    body: e.target.value
  }
})

submitBtn.addEventListener("click", () => {
  console.log(userData);
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