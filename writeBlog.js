const darkModeBtn = document.getElementById("darkModeBtn");
const addTitleForBlog = document.getElementById("addTitleForBlog");
const selectCategory = document.getElementById("selectCategory");
const addThumbnailimgage = document.getElementById("addThumbnailimgage");
const addBlogBody = document.getElementById("addBlogBody");
const submitBtn = document.getElementById("submitBtn");
const body = document.getElementById("body");

let blogData = {
  title: "",
  category: "",
  description: "",
  image: ""
};

const getToken = () => {
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
};

const initDarkMode = () => {
  if (!darkModeBtn || !body) return;

  const savedMode = localStorage.getItem("darkmode") || "light";
  
  applyDarkMode(savedMode);

  darkModeBtn.addEventListener("click", () => {
    const currentMode = localStorage.getItem("darkmode") || "light";
    const newMode = currentMode === "light" ? "dark" : "light";
    
    localStorage.setItem("darkmode", newMode);
    applyDarkMode(newMode);
    
    console.log("Dark mode toggled to:", newMode);
  });

  console.log("Dark mode initialized");
};

const applyDarkMode = (mode) => {
  if (!body) return;

  if (mode === "light") {
    body.classList.remove("bg-slate-900", "text-white");
    body.classList.add("bg-white", "text-black");
  } else {
    body.classList.remove("bg-white", "text-black");
    body.classList.add("bg-slate-900", "text-white");
  }
};

const getCategories = async () => {
  try {
    console.log("Loading categories...");

    const res = await fetch("https://ilkinibadov.com/api/b/blogs/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to load categories: ${res.status}`);
    }

    const categories = await res.json();
    console.log("Categories loaded:", categories);

    populateCategorySelect(categories);

  } catch (error) {
    console.error("Error loading categories:", error);
    alert("Could not load categories. Please refresh the page.");
  }
};

const populateCategorySelect = (categories) => {
  if (!selectCategory) {
    console.error("selectCategory element not found!");
    return;
  }

  selectCategory.innerHTML = '<option value="">Select Category</option>';

  if (Array.isArray(categories) && categories.length > 0) {
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      selectCategory.appendChild(option);
    });

    console.log(`${categories.length} categories loaded`);
  } else {
    console.warn("No categories found");
  }
};

const getAllBlogs = async () => {
  try {
    console.log("Fetching all blogs...");

    const res = await fetch("https://ilkinibadov.com/api/b/blogs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const blogs = await res.json();
    console.log("All blogs:", blogs);

  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};

const submitRequest = async () => {
  const token = getToken();

  if (!token) {
    alert("Please log in again");
    window.location.href = "/login.html";
    return;
  }

  if (!blogData.title || !blogData.category || !blogData.description) {
    alert("Please fill in all required fields");
    return;
  }


  try {
    console.log("Submitting blog:", blogData);

    const res = await fetch("https://ilkinibadov.com/api/b/blogs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/Json"
      },
      body: JSON.stringify(blogData)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Server error:", errorData);
      
      if (res.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login.html";
        return;
      }
      
      throw new Error(errorData.message || `Error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Blog created:", data);
    alert("Blog shared successfully!");

    resetForm();

  } catch (err) {
    console.error("Submit error:", err);
    alert(`Failed to create blog: ${err.message}`);
  }
};

const resetForm = () => {
  blogData = { 
    title: "", 
    category: "", 
    description: "", 
    image: null 
  };
  
  if (addTitleForBlog) addTitleForBlog.value = "";
  if (selectCategory) selectCategory.value = "";
  if (addBlogBody) addBlogBody.value = "";
  if (addThumbnailimgage) addThumbnailimgage.value = "";
  
  console.log("Form reset");
};

const initializeEventListeners = () => {

  if (addTitleForBlog) {
    addTitleForBlog.addEventListener("input", (e) => {
      blogData.title = e.target.value;
      console.log("Title:", blogData.title);
    });
  }

  if (selectCategory) {
    selectCategory.addEventListener("change", (e) => {
      blogData.category = e.target.value;
      console.log("Category:", blogData.category);
    });
  }

  if (addBlogBody) {
    addBlogBody.addEventListener("input", (e) => {
      blogData.description = e.target.value;
      console.log("Description:", blogData.description.substring(0, 50) + "...");
    });
  }

  if (addThumbnailimgage) {
    addThumbnailimgage.addEventListener("input", (e) => {
      blogData.image = e.target.value;
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Submit clicked:", blogData);
      submitRequest();
    });
  } else {
    console.error("submitBtn element not found!");
  }

  console.log("Event listeners initialized");
};

const init = () => {
  console.log("Initializing write blog page...");

  initDarkMode();

  const token = getToken();
  if (!token) {
    alert("Please log in first");
    window.location.href = "/login.html";
    return;
  }

  initializeEventListeners();

  getCategories();

  console.log("Page initialized successfully");
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}