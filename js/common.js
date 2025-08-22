// Common JavaScript functions and variables
const appData = {
  isLoggedIn: false,
  currentUser: null,
  settings: {
    theme: "dark",
    appLock: false,
    pin: null,
    dataProtection: true,
  },
  favorites: [],
  categories: [
    { id: "bein-sd", name: "beIN Sports | SD", icon: "fas fa-futbol", count: 12 },
    { id: "bein-hd", name: "beIN Sports | HD", icon: "fas fa-tv", count: 8 },
    { id: "ssc", name: "Saudi Sports Company", icon: "fas fa-crown", count: 6 },
    { id: "open-sports", name: "القنوات الرياضية المفتوحة", icon: "fas fa-satellite-dish", count: 15 },
    { id: "highlights", name: "اهداف و ملخصات", icon: "fas fa-video", count: 25 },
  ],
  channels: {},
  highlights: [],
}

// Utility Functions
function showLoader() {
  return new Promise((resolve) => {
    const loader = document.createElement("div")
    loader.className = "loader"
    loader.innerHTML = '<div class="spinner"></div>'
    document.body.appendChild(loader)

    setTimeout(() => {
      document.body.removeChild(loader)
      resolve()
    }, 1000)
  })
}

function showToast(message, duration = 3000) {
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => toast.classList.add("show"), 100)

  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => document.body.removeChild(toast), 300)
  }, duration)
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to storage:", error)
  }
}

function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error("Error loading from storage:", error)
    return defaultValue
  }
}

function navigateTo(page) {
  window.location.href = page
}

function goBack() {
  if (document.referrer && document.referrer.includes(window.location.origin)) {
    window.history.back()
  } else {
    navigateTo("main.html")
  }
}

// Theme Management
function toggleTheme() {
  const body = document.body
  const isDark = !body.classList.contains("light-mode")

  if (isDark) {
    body.classList.add("light-mode")
    appData.settings.theme = "light"
  } else {
    body.classList.remove("light-mode")
    appData.settings.theme = "dark"
  }

  saveToStorage("appSettings", appData.settings)
  showToast(isDark ? "تم التبديل للوضع الفاتح" : "تم التبديل للوضع المظلم")
}

function loadThemePreference() {
  const settings = loadFromStorage("appSettings", appData.settings)
  appData.settings = { ...appData.settings, ...settings }

  if (appData.settings.theme === "light") {
    document.body.classList.add("light-mode")
  }

  // Update theme toggles
  const themeToggles = document.querySelectorAll("#settings-theme-toggle, #theme-toggle-checkbox")
  themeToggles.forEach((toggle) => {
    if (toggle) toggle.checked = appData.settings.theme === "dark"
  })
}

// Search Functionality
function performSearch(query) {
  const searchResults = document.getElementById("search-results")
  if (!searchResults) return

  if (!query.trim()) {
    searchResults.classList.remove("active")
    return
  }

  // Simulate search results
  const results = [
    { name: "beIN Sports 1 HD", category: "beIN Sports HD", url: "video-player.html?channel=bein1hd" },
    { name: "beIN Sports 2 HD", category: "beIN Sports HD", url: "video-player.html?channel=bein2hd" },
    { name: "SSC 1 HD", category: "Saudi Sports", url: "video-player.html?channel=ssc1hd" },
  ].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  searchResults.innerHTML = results
    .map(
      (result) => `
        <div class="search-result-item" onclick="navigateTo('${result.url}')">
            <div class="search-result-name">${result.name}</div>
            <div class="search-result-category">${result.category}</div>
        </div>
    `,
    )
    .join("")

  searchResults.classList.add("active")
}

// Remote Control Support
document.addEventListener("keydown", (event) => {
  const key = event.key
  const activeElement = document.activeElement

  // Handle remote control keys
  switch (key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      event.preventDefault()
      handleArrowKeys(key)
      break
    case "Enter":
      event.preventDefault()
      handleEnterKey()
      break
    case "Escape":
    case "Backspace":
      event.preventDefault()
      handleBackKey()
      break
  }
})

function handleArrowKeys(direction) {
  const focusableElements = document.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )

  const currentIndex = Array.from(focusableElements).indexOf(document.activeElement)
  let nextIndex

  switch (direction) {
    case "ArrowUp":
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
      break
    case "ArrowDown":
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
      break
    case "ArrowLeft":
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
      break
    case "ArrowRight":
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
      break
  }

  if (focusableElements[nextIndex]) {
    focusableElements[nextIndex].focus()
  }
}

function handleEnterKey() {
  const activeElement = document.activeElement
  if (activeElement) {
    activeElement.click()
  }
}

function handleBackKey() {
  // Check if there's a modal open
  const activeModal = document.querySelector(".modal.active")
  if (activeModal) {
    activeModal.classList.remove("active")
    return
  }

  // Check if search is open
  const searchContainer = document.querySelector(".search-container.active")
  if (searchContainer) {
    searchContainer.classList.remove("active")
    return
  }

  // Check if side menu is open
  const sideMenu = document.querySelector(".side-menu.open")
  if (sideMenu) {
    sideMenu.classList.remove("open")
    document.querySelector(".overlay").classList.remove("active")
    return
  }

  // Otherwise go back
  goBack()
}

// Initialize common functionality
document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference()

  // Add focus styles for remote control
  const style = document.createElement("style")
  style.textContent = `
        *:focus {
            outline: 2px solid var(--accent-color) !important;
            outline-offset: 2px;
        }
        
        .search-result-item {
            padding: 15px 20px;
            border-bottom: 1px solid var(--secondary-bg);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .search-result-item:hover,
        .search-result-item:focus {
            background-color: var(--secondary-bg);
        }
        
        .search-result-name {
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 5px;
        }
        
        .search-result-category {
            font-size: 12px;
            color: #888;
        }
    `
  document.head.appendChild(style)
})
