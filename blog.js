const darkModeBtn = document.getElementById("darkModeBtn")
const blogCategory = document.getElementById("blogCategory")
const blogTitle = document.getElementById("blogTitle")
const blogAuthor = document.getElementById("blogAuthor")
const blogDate = document.getElementById("blogDate")
const blogImage = document.getElementById("blogImage")
const blogContent = document.getElementById("blogContent")

function getBlogIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id')
}
async function getBlogDetails() {
  const blogId = getBlogIdFromURL()
  
  if (!blogId) {
    alert("Blog not found! Redirecting to home page...")
    window.location.href = "index.html"
    return
  }

  try {
    console.log("Fetching blog details for ID:", blogId)

    const res = await fetch(`https://ilkinibadov.com/api/b/blogs/blog/${blogId}`)
    
    if (!res.ok) {
      throw new Error(`Blog not found: ${res.status}`)
    }

    const data = await res.json()
   
    const blog = data.blog || data
    
    console.log("Blog details loaded:", blog)

    displayBlogDetails(blog)
    
  } catch (error) {
    console.error("Error fetching blog:", error)
    alert("Failed to load blog. Redirecting to home page...")
    window.location.href = "index.html"
  }
}

function displayBlogDetails(blog) {
  if (!blog) {
    console.error("No blog data to display")
    return
  }

  if (blogCategory) {
    blogCategory.textContent = blog.category || "Uncategorized"
    blogCategory.className = "text-md bg-blue-500 text-white w-fit px-4 py-2 rounded-[6px] text-center"
  }

  if (blogTitle) {
    blogTitle.textContent = blog.title || "Untitled Blog"
  }
  if (blogAuthor) {
    blogAuthor.textContent = blog.author || blog.user?.firstname + " " + blog.user?.lastname || "Anonymous"
  }

  if (blogDate) {
    const date = blog.createdAt ? new Date(blog.createdAt) : new Date()
    blogDate.textContent = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (blogImage) {
    blogImage.src = blog.image || "homepagephoto/tower.png"
    blogImage.alt = blog.title || "Blog Image"
  }

  if (blogContent) {
    const content = blog.description || blog.content || "No content available."

    const paragraphs = content.split('\n\n').filter(p => p.trim())
    
    if (paragraphs.length > 0) {
      blogContent.innerHTML = paragraphs.map(para => 
        `<p class="mb-[30px] leading-relaxed">${para.replace(/\n/g, '<br>')}</p>`
      ).join('')
    } else {

      blogContent.innerHTML = `<p class="mb-[30px] leading-relaxed">${content}</p>`
    }
  }

  document.title = blog.title || "Blog Details"

  console.log("Blog details displayed successfully")
}

darkModeBtn.addEventListener("click", () => {
  const darkmode = localStorage.getItem("darkmode")
  localStorage.setItem("darkmode", darkmode === "light" ? "dark" : "light")

  const currentMode = localStorage.getItem("darkmode")
  console.log("Dark mode:", currentMode)

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

  getBlogDetails()
})