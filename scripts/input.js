const form = document.querySelector(".input-form"),
loginErrorMessage = document.querySelector(".login-error-message"),
fields = {
    name: form?.querySelector("input[name='name']"),
    email: form?.querySelector("input[name='email']"),
    password: form?.querySelector("input[name='password']"),
    confirmPassword: form?.querySelector("input[name='confirmPassword']"),
    tel: form?.querySelector("input[name='tel']"),
    guests: form?.querySelector("input[name='guests']"),
    date: form?.querySelector("input[name='date']"),
    time: form?.querySelector("input[name='time']"),
    message: form?.querySelector("textarea[name='message']"),
},
errors = {
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    tel: false,
    guests: false,
    date: false,
    time: false,
    message: false,
}

form?.addEventListener("input", e => validateField(e.target.name))
form?.addEventListener("focusout", e => validateField(e.target.name, true))

form?.addEventListener("submit", e => {
    e.preventDefault()
    validateForm() && form?.submit()
})

form?.querySelectorAll(".input-floating-label").forEach(label => label.addEventListener("transitionend", () => label.classList.remove("shake")))

form?.querySelectorAll(".input-password-visible-icon, .input-password-hidden-icon").forEach(icon => icon.addEventListener("click", () => {
    const input = icon.closest(".field").querySelector("input")
    input.type = input.type === "password" ? "text" : "password"
}))

function toggleError(field, bool, notify = false, force = false) {
    loginErrorMessage?.remove()
    errors[field] = bool
    const fieldEl = fields[field].closest(".field"),
    helperText = fieldEl.querySelector(".helper-text"),
    floatingLabel = fieldEl.querySelector(".input-floating-label"),
    input = fieldEl.querySelector("input")
    if (bool && notify) {
        fieldEl.classList.add("error")
        helperText.classList.add("show")
        floatingLabel.classList.add("shake")
    } else if (!bool) {
        fieldEl.classList.remove("error")
        helperText.classList.remove("show")
    }
    if (!force) 
    if (input.value === "") {
        fieldEl.classList.remove("error")
        helperText.classList.remove("show") 
    }
}

function validateField(field, notify = false, force = false) {
    if (!fields[field]) return
    const value = fields[field].value.trim()
    let errorCondition
    switch(field) {
        case "name": 
            errorCondition = !/^.{2,}$/.test(value)
            break
        case "email":
            errorCondition = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            break
        case "password":
            let strengthLevel = 0
            if (/[a-z]/.test(value)) strengthLevel ++
            if (/[A-Z]/.test(value)) strengthLevel ++
            if (/[0-9]/.test(value)) strengthLevel ++
            if (/[\W_]/.test(value)) strengthLevel ++
            if (value.length < 8) strengthLevel = 1
            fields[field].closest(".field").querySelector(".password-meter")?.setAttribute("data-strength-level", strengthLevel)
            errorCondition = value.length < 8
            break
        case "confirmPassword":
            errorCondition = value === "" || value !== fields.password.value.trim()
            break
        case "tel":
            errorCondition = !/^\+?(\d[\d-.()\s]*){7,15}$/.test(value)
            break
        case "guests":
            errorCondition = !/^\d+$/.test(value) || value < 1
            break
        case "date":
            errorCondition = !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value) < new Date()
            break
        case "time":
            errorCondition = !/^\d{2}:\d{2}$/.test(value)
            break
        case "message":
            errorCondition = value.length < 10
            break            
        default: 
            errorCondition = false
    }
    toggleError(field, errorCondition, notify, force)
}

function validateForm() {
    Object.keys(fields).forEach(field => validateField(field, true, true))
    return Object.values(errors).filter(error => !error).length === Object.keys(errors).length
}