const darkModeBtn = document.getElementById("darkModeBtn")
const blogCarts = document.getElementById("blogCarts")
const loadMoreBtn = document.getElementById("loadMoreBtn")
const searchInput = document.getElementById("searchInput")
const categoriesContainer = document.getElementById("categoriesContainer")
const blogsTitle = document.getElementById("blogsTitle")

let selectedCategory = ''
let searchTerm = ''
let currentPage = 1
let limit = 8
let totalBlogs = 0

searchInput.addEventListener("input", (e) => {
  selectedCategory = ''
  searchTerm = e.target.value
  currentPage = 1
  blogsTitle.innerText = searchTerm || 'All Blogs'
  getAllBlogs()
})

async function getCategories() {
  try {
    const res = await fetch('https://ilkinibadov.com/api/b/blogs/categories')
    
    if (res.ok) {
      const categories = await res.json()
      
      categories.forEach(category => {
        const button = document.createElement('button')
        button.innerText = category
        button.classList.add("border", "border-zinc-300", "p-5", "rounded-lg", "hover:cursor-pointer", "hover:bg-zinc-100", "categoryBtns")

        button.addEventListener('click', () => {
          selectedCategory = ''
          removeSelect()
          selectedCategory = category
          searchTerm = ''
          currentPage = 1
          blogsTitle.innerText = category.toUpperCase()
          button.classList.add("!border-red-500")
          searchInput.value = ''
          getAllBlogs()
        })
        
        categoriesContainer.append(button)
      })
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

function removeSelect() {
  let categoryBtns = Array.from(document.getElementsByClassName('categoryBtns'))
  categoryBtns.forEach(btn => {
    btn.classList.remove("!border-red-500")
  })
}

darkModeBtn.addEventListener("click", () => {
  const darkmode = localStorage.getItem("darkmode")
  localStorage.setItem("darkmode", darkmode === "light" ? "dark" : "light")

  const currentMode = localStorage.getItem("darkmode")
  console.log(currentMode)

  const body = document.getElementById("body")

  if (currentMode === "light") {
    body.classList.remove("bg-slate-900", "text-white")
    body.classList.add("bg-white", "text-black")
  } else {
    body.classList.remove("bg-white", "text-black")
    body.classList.add("bg-slate-900", "text-white")
  }
})

loadMoreBtn.addEventListener("click", () => {
  currentPage++
  getAllBlogs(true)
})

async function getAllBlogs(append = false) {
  try {
    let url = `https://ilkinibadov.com/api/b/blogs?page=${currentPage}&limit=${limit}`

    if (selectedCategory) {
      url += `&category=${encodeURIComponent(selectedCategory)}`
    }

    if (searchTerm.length >= 3) {
      url += `&search=${encodeURIComponent(searchTerm)}`
    }

    if (!append) {
      blogCarts.innerHTML = '<p class="text-center">Loading...</p>'
    }

    const res = await fetch(url)

    if (res.status === 404) {
      blogCarts.innerHTML = ''
      const h2 = document.createElement('h2')
      h2.innerText = "No blogs found"
      h2.classList.add('text-center', 'text-2xl', 'font-bold', 'col-span-full')
      blogCarts.append(h2)
      loadMoreBtn.classList.add('hidden')
      return
    }

    if (res.ok) {
      const data = await res.json()
      
      if (!append) {
        blogCarts.innerHTML = ''
      }

      totalBlogs = data.totalBlogs || data.total || 0
      const blogs = data.blogs || data.data || []

      if (blogs.length === 0 && !append) {
        const h2 = document.createElement('h2')
        h2.innerText = "No blogs found"
        h2.classList.add('text-center', 'text-2xl', 'font-bold', 'col-span-full')
        blogCarts.append(h2)
        loadMoreBtn.classList.add('hidden')
        return
      }

      renderBlogs(blogs)
      if (blogs.length < limit) {
        loadMoreBtn.classList.add('hidden')
      } else {
        loadMoreBtn.classList.remove('hidden')
      }
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    blogCarts.innerHTML = '<p class="text-center text-red-500">Error loading blogs. Please try again.</p>'
  }
}

const renderBlogs = (blogs) => {
  blogs.forEach(blog => {
    const div = document.createElement('div')
    const img = document.createElement('img')
    const h3 = document.createElement('h3')
    const p = document.createElement('p')
    const categorySpan = document.createElement('span')
    const dateSpan = document.createElement('span')
    const a = document.createElement('a')

    img.src = blog.image || blog.coverImage || 'https://via.placeholder.com/350'
    img.classList.add('w-full', 'h-[250px]', 'object-cover', 'rounded-t-xl')
    img.alt = blog.title

    h3.innerText = blog.title
    h3.classList.add("font-bold", 'text-xl', 'mt-3')

    const excerpt = blog.excerpt || blog.description || blog.content?.substring(0, 150) || ''
    p.innerText = excerpt + (excerpt.length >= 150 ? '...' : '')
    p.classList.add('text-sm', 'text-gray-600', 'dark:text-gray-400', 'my-2', 'line-clamp-3')

    categorySpan.innerText = blog.category || 'Uncategorized'
    categorySpan.classList.add('inline-block', 'bg-blue-500', 'text-white', 'text-xs', 'px-3', 'py-1', 'rounded-full', 'mb-2')

    if (blog.createdAt || blog.date) {
      const date = new Date(blog.createdAt || blog.date)
      dateSpan.innerText = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
      dateSpan.classList.add('text-xs', 'text-gray-500', 'block', 'mt-2')
    }

    div.classList.add('h-full', 'mx-5', 'border', 'border-zinc-300', 'rounded-xl', 'flex', 'flex-col', 'shadow-xl', 'hover:shadow-2xl', 'transition-shadow', 'overflow-hidden', 'bg-white', 'dark:bg-slate-800', 'dark:border-slate-700')
    
    const contentDiv = document.createElement('div')
    contentDiv.classList.add('p-4')
    contentDiv.append(categorySpan)
    contentDiv.append(h3)
    contentDiv.append(p)
    contentDiv.append(dateSpan)

    div.append(img)
    div.append(contentDiv)

    a.classList.add('w-full', 'h-full', 'cursor-pointer')
    a.setAttribute('href', `blog-detail.html?id=${blog._id || blog.id}`)
    
    a.append(div)
    blogCarts.append(a)
  })
}

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

  getCategories()
  getAllBlogs()
})