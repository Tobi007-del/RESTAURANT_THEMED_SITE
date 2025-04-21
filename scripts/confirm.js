export default function Confirm(question) {
    return new Promise(resolve => new tasteyConfirmDialog({question, resolve}))
}

class tasteyConfirmDialog {
    #dialog
    #resolve
    #confirmBtn
    #cancelBtn
    constructor({question, resolve }) {
        this.#resolve = resolve
        this.#dialog = document.createElement("dialog")
        this.#dialog.classList.add("tastey-dialog")
        document.body.append(this.#dialog)
        this.render(question)
        this.show()
    }

    render(question) {
        this.#dialog.innerHTML =  
        `
            <div class="dialog-top-section">
                <p class="dialog-question">${question}</p>
            </div>
            <div class="dialog-bottom-section">
                <button class="dialog-confirm-button" type="button" title="OK">OK</button>
                <button class="dialog-cancel-button" type="button" title="Cancel">Cancel</button>
            </div>
        `
        this.#confirmBtn = this.#dialog.querySelector(".dialog-confirm-button")
        this.#cancelBtn = this.#dialog.querySelector(".dialog-cancel-button")
        this.#confirmBtn.addEventListener("click", this.confirm.bind(this))
        this.#cancelBtn.addEventListener("click", this.cancel.bind(this))
    }

    show() {
        this.#dialog.showModal()
        document.addEventListener("keyup", this.handleKeyUp.bind(this))
        this.#confirmBtn.focus()
    }

    remove() {
        this.#dialog.close()
        this.#dialog.remove()
    }

    confirm() {
        this.remove()
        this.#resolve(true)
    }

    cancel() {
        this.remove()
        this.#resolve(false)
    }

    handleKeyUp(e) {
        const key = e.key.toString().toLowerCase() 
        if (document.activeElement.tagName === 'INPUT') return
        switch(key) {
            case "escape":
                this.cancel()
                break
        }
    }
}