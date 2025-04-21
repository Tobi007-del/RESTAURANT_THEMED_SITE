window.validateFormOnServer = window.validateFormOnServer ?? async function() { return true }

const forms = document.querySelectorAll(".input-form"),
loginErrorMessage = document.querySelector(".login-error-message"),
violationsPriority = ["valueMissing", "typeMismatch", "patternMismatch", "stepMismatch", "tooShort", "tooLong", "rangeUnderflow", "rangeOverflow", "badInput", "customError"]

forms.forEach((form, n) => {
const inputs = form?.getElementsByClassName("input")
form?.addEventListener("input", ({ target }) => {
    const isFilled = target.type === "checkbox" || target.type === "radio" ? target.checked : target.value !== '' || target.files?.length > 0
    target.toggleAttribute("data-filled", isFilled)
    validateInput(target)
})

form?.addEventListener("focusout", ({ target }) => validateInput(target, true))

form?.addEventListener("submit", async e => {
    toggleSubmitLoader(true)
    try {
        e.preventDefault()
        if (!validateFormOnClient()) return
        if (!await window.validateFormOnServer()) return 
        form?.submit()
    } catch(error) {
        console.log(error)
    } finally {
        toggleSubmitLoader(false)
    }
})

form?.querySelectorAll(".input-floating-label").forEach(label => label.addEventListener("transitionend", () => label.classList.remove("shake")))

form?.querySelectorAll(".input-password-visible-icon, .input-password-hidden-icon").forEach(icon => icon.addEventListener("click", () => {
    const input = icon.closest(".field").querySelector(".input")
    input.type = input.type === "password" ? "text" : "password"
}))

function toggleSubmitLoader(bool) {
    form?.classList.toggle("submit-loading", bool)
}

function toggleError(input, bool, notify = false, force = false) {
    if (loginErrorMessage) loginErrorMessage.textContent = ""
    const fieldEl = input.closest(".field"),
    floatingLabel = fieldEl.querySelector(".input-floating-label")
    if (bool && notify) {
        fieldEl.classList.add("error")
        toggleHelper(input, true)
        floatingLabel.classList.add("shake")
    } else if (!bool) {
        fieldEl.classList.remove("error")
        toggleHelper(input, false)
    }
    if (!force) 
    if (input.value === "") {
        fieldEl.classList.remove("error")
        toggleHelper(input, false) 
    }
}

function toggleHelper(input, bool) {
    const violation = violationsPriority.find(violation => input.validity[violation]) ?? "invalid"
    input.closest(".field").querySelectorAll(`.helper-text:not([data-violation="${violation}"])`).forEach(helper => helper.classList.remove("show"))
    input.closest(".field").querySelector(`.helper-text[data-violation="${violation}"]`)?.classList.toggle("show", bool)
}

function forceRevalidate(input) {
    input.checkValidity()
    input.dispatchEvent(new Event('input'))
}

function validateInput(input, notify = false, force = false) {
    if (!input.classList.contains("input")) return
    let value, errorCondition, file
    switch(input.name) {
        case "password":
            value = input.value?.trim()
            let strengthLevel = 0
            if (value.length < 8) strengthLevel = 1
            else {
                if (/[a-z]/.test(value)) strengthLevel ++
                if (/[A-Z]/.test(value)) strengthLevel ++
                if (/[0-9]/.test(value)) strengthLevel ++
                if (/[\W_]/.test(value)) strengthLevel ++
            }
            input.closest(".field").querySelector(".password-meter")?.setAttribute("data-strength-level", strengthLevel)
            errorCondition = value.length < 8
            break
        case "confirm-password":
            value = input.value?.trim()
            errorCondition = value === "" || value !== [...inputs].find(input => input.name === "password")?.value?.trim()
            break     
        case "image":
            file = input.files?.[0]
            errorCondition = !file ? input.required : !file.type.startsWith("image/")
            break
        case "date":
            if (input.min) break
            input.min = new Date().toISOString().split('T')[0]
            forceRevalidate(input)
            break
    }
    errorCondition = errorCondition ?? !input.validity?.valid
    toggleError(input, errorCondition, notify, force)
}

function validateFormOnClient() {
    Array.from(inputs)?.forEach(input => validateInput(input, true, true))
    return Array.from(inputs).every(input => input.validity.valid)
}

window[`validateFormOnClient${n+1}`] = validateFormOnClient
})