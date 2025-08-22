// Login page functionality
document.addEventListener("DOMContentLoaded", () => {
  const activationCodeInput = document.getElementById("activation-code")
  const loginBtn = document.getElementById("login-btn")

  // Declare variables
  const appData = { isLoggedIn: false, currentUser: null }
  function showToast(message) {
    alert(message)
  }
  function showLoader() {
    return new Promise((resolve) => {
      setTimeout(resolve, 500) // Simulate loader delay
    })
  }
  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
  function loadFromStorage(key, defaultValue) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  }
  function navigateTo(url) {
    window.location.href = url
  }

  // Focus on input when page loads
  if (activationCodeInput) {
    activationCodeInput.focus()
  }

  // Handle login
  function login() {
    const code = activationCodeInput.value.trim()

    if (!code) {
      showToast("يرجى إدخال رمز التفعيل")
      return
    }

    // Simulate login process
    showLoader().then(() => {
      if (code === "1234" || code === "demo") {
        appData.isLoggedIn = true
        appData.currentUser = { code: code }
        saveToStorage("loginStatus", appData.isLoggedIn)
        saveToStorage("currentUser", appData.currentUser)

        showToast("تم تسجيل الدخول بنجاح")
        setTimeout(() => {
          navigateTo("main.html")
        }, 1000)
      } else {
        showToast("رمز التفعيل غير صحيح")
        activationCodeInput.value = ""
        activationCodeInput.focus()
      }
    })
  }

  // Event listeners
  if (loginBtn) {
    loginBtn.addEventListener("click", login)
  }

  if (activationCodeInput) {
    activationCodeInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        login()
      }
    })
  }

  // Check if already logged in
  const isLoggedIn = loadFromStorage("loginStatus", false)
  if (isLoggedIn) {
    navigateTo("main.html")
  }
})
