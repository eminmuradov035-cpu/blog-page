const darkModeBtn = document.getElementById("darkModeBtn")

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

  checkAuth()
  fetchMyBlogs()
})

function getToken() {
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
}

function checkAuth() {
  const token = getToken()
  
  if (!token) {
    alert("Please log in to view your blogs")
    window.location.href = "signin.html"
    return false
  }
  
  return true
}

async function fetchMyBlogs() {
  const token = getToken()
  
  if (!token) return

  const blogsContainer = document.getElementById("myBlogsContainer")
  
  if (!blogsContainer) {
    console.error("myBlogsContainer element not found!")
    return
  }

  try {
    blogsContainer.innerHTML = '<p class="text-center col-span-full">Loading your blogs...</p>'

    const response = await fetch("https://ilkinibadov.com/api/b/blogs/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    if (response.status === 401) {
      alert("Session expired. Please log in again.")
      localStorage.removeItem("accessToken")
      sessionStorage.removeItem("accessToken")
      window.location.href = "signin.html"
      return
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const blogs = data.blogs || data.data || data

    console.log("My blogs loaded:", blogs)

    displayMyBlogs(blogs)

  } catch (error) {
    console.error("Error fetching my blogs:", error)
    blogsContainer.innerHTML = '<p class="text-center text-red-500 col-span-full">Failed to load your blogs. Please try again.</p>'
  }
}

function displayMyBlogs(blogs) {
  const blogsContainer = document.getElementById("myBlogsContainer")

  if (!blogsContainer) return

  blogsContainer.innerHTML = ""

  if (!Array.isArray(blogs) || blogs.length === 0) {
    blogsContainer.innerHTML = `
      <div class="col-span-full text-center py-20">
        <h2 class="text-2xl font-bold mb-4">You haven't created any blogs yet</h2>
        <a href="WritenewBlog.html" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block">
          Create Your First Blog
        </a>
      </div>
    `
    return
  }

  blogs.forEach(blog => {
    const blogCard = document.createElement('div')
    blogCard.className = 'border border-zinc-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-slate-800 dark:border-slate-700 flex flex-col'

    const img = document.createElement('img')
    img.src = blog.image || 'https://via.placeholder.com/350x200'
    img.alt = blog.title
    img.className = 'w-full h-[200px] object-cover'

    const contentDiv = document.createElement('div')
    contentDiv.className = 'p-5 flex-1 flex flex-col'

    const categorySpan = document.createElement('span')
    categorySpan.textContent = blog.category || 'Uncategorized'
    categorySpan.className = 'inline-block bg-blue-600 text-white font-bold text-xs px-8 py-2 rounded-full mb-3'

    const title = document.createElement('h3')
    title.textContent = blog.title
    title.className = 'font-bold text-xl mb-2 line-clamp-2'

    const description = document.createElement('p')
    const excerpt = blog.description || blog.content || ''
    description.textContent = excerpt.substring(0, 100) + (excerpt.length > 100 ? '...' : '')
    description.className = 'text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1'

    const dateSpan = document.createElement('span')
    if (blog.createdAt) {
      const date = new Date(blog.createdAt)
      dateSpan.textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    dateSpan.className = 'text-xs text-gray-500 block mb-4'

    const buttonsDiv = document.createElement('div')
    buttonsDiv.className = 'flex gap-3 mt-auto'

    const viewBtn = document.createElement('button')
    viewBtn.textContent = 'View'
    viewBtn.className = 'flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer'
    viewBtn.addEventListener('click', () => {
      window.location.href = `blog.html?id=${blog._id || blog.id}`
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.className = 'flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer'
    deleteBtn.addEventListener('click', () => {
      confirmDeleteBlog(blog._id || blog.id, blog.title)
    })

    buttonsDiv.appendChild(viewBtn)
    buttonsDiv.appendChild(deleteBtn)

    contentDiv.appendChild(categorySpan)
    contentDiv.appendChild(title)
    contentDiv.appendChild(description)
    contentDiv.appendChild(dateSpan)
    contentDiv.appendChild(buttonsDiv)

    blogCard.appendChild(img)
    blogCard.appendChild(contentDiv)

    blogsContainer.appendChild(blogCard)
  })

  console.log(`${blogs.length} blogs displayed`)
}

function confirmDeleteBlog(blogId, blogTitle) {
  const confirmed = confirm(`Are you sure you want to delete "${blogTitle}"?\n\nThis action cannot be undone.`)
  
  if (confirmed) {
    deleteBlog(blogId)
  }
}

async function deleteBlog(blogId) {
  const token = getToken()

  if (!token) {
    alert("Please log in again")
    window.location.href = "signin.html"
    return
  }

  try {
    console.log("Deleting blog:", blogId)

    const response = await fetch(`https://ilkinibadov.com/api/b/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    if (response.status === 401) {
      alert("Session expired. Please log in again.")
      localStorage.removeItem("accessToken")
      sessionStorage.removeItem("accessToken")
      window.location.href = "signin.html"
      return
    }

    if (!response.ok) {
      throw new Error(`Failed to delete blog: ${response.status}`)
    }

    console.log("Blog deleted successfully")
    alert("Blog deleted successfully!")

    fetchMyBlogs()

  } catch (error) {
    console.error("Error deleting blog:", error)
    alert("Failed to delete blog. Please try again.")
  }
}