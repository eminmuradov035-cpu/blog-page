const darkModeBtn = document.getElementById("darkModeBtn");
const addTitleForBlog = document.getElementById("addTitleForBlog");
const selectCategory = document.getElementById("selectCategory");
const addThumbnailimgage = document.getElementById("addThumbnailimgage");
const addBlogBody = document.getElementById("addBlogBody");
const submitBtn = document.getElementById("submitBtn");

let blogData = {
  title: "",
  category: "",
  content: "",
  thumbnail: null
};

const token =
  localStorage.getItem("accessToken") ||
  sessionStorage.getItem("accessToken");

const submitRequest = async () => {
  if (!token) {
    alert("Please log in again");
    return;
  }

  if (!blogData.title || !blogData.category || !blogData.content) {
    alert("Please fill in all required fields");
    return;
  }

  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("category", blogData.category);
  formData.append("content", blogData.content);

  if (blogData.thumbnail) {
    formData.append("thumbnail", blogData.thumbnail);
  }

  try {
    const res = await fetch("https://ilkinibadov.com/api/blogs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Blog not created");
    }

    const data = await res.json();
    console.log("Blog created:", data);
    alert("Blog shared successfully");

    blogData = { title: "", category: "", content: "", thumbnail: null };
    addTitleForBlog.value = "";
    selectCategory.value = "";
    addBlogBody.value = "";
    addThumbnailimgage.value = "";

  } catch (err) {
    console.error("Error:", err);
    alert(err.message);
  }
};

if (addTitleForBlog) {
  addTitleForBlog.addEventListener("input", e => {
    blogData.title = e.target.value;
  });
}

if (selectCategory) {
  selectCategory.addEventListener("input", e => {
    blogData.category = e.target.value;
  });
}

if (addBlogBody) {
  addBlogBody.addEventListener("input", e => {
    blogData.content = e.target.value;
  });
}

if (addThumbnailimgage) {
  addThumbnailimgage.addEventListener("change", e => {
    blogData.thumbnail = e.target.files[0];
  });
}

if (submitBtn) {
  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    submitRequest();
  });
}