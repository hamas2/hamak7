// Main page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Declare variables
  const loadFromStorage = (key, defaultValue) => {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : defaultValue
  }

  const navigateTo = (url) => {
    window.location.href = url
  }

  const appData = {
    categories: [
      { id: 1, icon: "fas fa-music", name: "موسيقى", count: 10 },
      { id: 2, icon: "fas fa-film", name: "أفلام", count: 20 },
      { id: 3, icon: "fas fa-gamepad", name: "ألعاب", count: 15 },
    ],
  }

  const performSearch = (query) => {
    console.log("Searching for:", query)
    // Implement search logic here
  }

  const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const showToast = (message) => {
    console.log(message)
    // Implement toast logic here
  }

  // Check login status
  const isLoggedIn = loadFromStorage("loginStatus", false)
  if (!isLoggedIn) {
    navigateTo("index.html")
    return
  }

  // DOM elements
  const menuBtn = document.getElementById("menu-btn")
  const sideMenu = document.getElementById("side-menu")
  const closeMenuBtn = document.getElementById("close-menu-btn")
  const overlay = document.getElementById("overlay")
  const searchBtn = document.getElementById("main-search-btn")
  const searchContainer = document.getElementById("search-container")
  const searchCloseBtn = document.getElementById("search-close-btn")
  const searchInput = document.getElementById("search-input")
  const allChannelsBtn = document.getElementById("all-channels-btn")
  const categoriesContainer = document.getElementById("categories-container")
  const closeNotification = document.querySelector(".close-notification")

  // Load categories
  function loadCategories() {
    if (!categoriesContainer) return

    categoriesContainer.innerHTML = appData.categories
      .map(
        (category) => `
            <div class="category-card" onclick="navigateTo('channels.html?category=${category.id}')">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.count} قناة</div>
            </div>
        `,
      )
      .join("")
  }

  // Toggle side menu
  function toggleSideMenu() {
    if (sideMenu && overlay) {
      sideMenu.classList.toggle("open")
      overlay.classList.toggle("active")
    }
  }

  // Toggle search
  function toggleSearch() {
    if (searchContainer) {
      searchContainer.classList.toggle("active")
      if (searchContainer.classList.contains("active") && searchInput) {
        searchInput.focus()
      }
    }
  }

  // Event listeners
  if (menuBtn) {
    menuBtn.addEventListener("click", toggleSideMenu)
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", toggleSideMenu)
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      sideMenu?.classList.remove("open")
      overlay.classList.remove("active")
      searchContainer?.classList.remove("active")
    })
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", toggleSearch)
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", toggleSearch)
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      performSearch(event.target.value)
    })
  }

  if (allChannelsBtn) {
    allChannelsBtn.addEventListener("click", () => {
      navigateTo("all-channels.html")
    })
  }

  if (closeNotification) {
    closeNotification.addEventListener("click", () => {
      const notificationBar = document.querySelector(".notification-bar")
      if (notificationBar) {
        notificationBar.style.display = "none"
        saveToStorage("notificationClosed", true)
      }
    })
  }

  // Menu item handlers
  const logoutLink = document.getElementById("logout-link")
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault()
      localStorage.clear()
      showToast("تم تسجيل الخروج")
      setTimeout(() => {
        navigateTo("index.html")
      }, 1000)
    })
  }

  // Initialize
  loadCategories()

  // Check notification status
  const notificationClosed = loadFromStorage("notificationClosed", false)
  if (notificationClosed) {
    const notificationBar = document.querySelector(".notification-bar")
    if (notificationBar) {
      notificationBar.style.display = "none"
    }
  }
})
