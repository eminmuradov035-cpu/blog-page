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

  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("category", blogData.category);
  formData.append("content", blogData.content);
  formData.append("thumbnail", blogData.thumbnail);

  try {
    const res = await fetch("https://ilkinibadov.com/api/blogs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error("Blog not created");
    }

    const data = await res.json();
    console.log("Blog created:", data);
    alert("Blog shared successfully");

  } catch (err) {
    console.error(err.message);
    alert(err.message);
  }
};

addTitleForBlog.addEventListener("input", e => {
  blogData.title = e.target.value;
});

selectCategory.addEventListener("input", e => {
  blogData.category = e.target.value;
});

addBlogBody.addEventListener("input", e => {
  blogData.content = e.target.value;
});

addThumbnailimgage.addEventListener("change", e => {
  blogData.thumbnail = e.target.files[0];
});

submitBtn.addEventListener("click", e => {
  e.preventDefault();
  submitRequest();
});
