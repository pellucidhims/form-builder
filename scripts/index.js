const createNode = (node = '') => {
    return !!node && document.createElement(node)
}
    /*
        Uncomment line marked with (*) in append function to see the parent and child rendered when any field encounters change event. 
        change event on any field will trigger re-render for only those fields, data of which is updated leaving the rest of shadowDOM as is.
    */
const append = (parent = '', child = '') => {

    // console.log('parent: ', parent, ' child: ', child)        //(*)
    return !!parent && !!child && parent.appendChild(child)
}

class FormBuilder extends HTMLElement {
    constructor() {
        super();
        this._state = {}
        this._genericFieldValidator = null
        var template = document.querySelector("template");

        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.appendChild(template.content.cloneNode(true));
    }

    set metaData(metaData) {
        if (metaData) {
            this._metaData = metaData
            this.initState(metaData)
            this.createFields()
        }
    }

    get metaData() {
        return this._metaData
    }

    get state() {
        return this._state
    }

    connectedCallback() {
        console.log('component loaded!')
    }

    initState(metaData) {

        metaData.forEach(data => {
            if (data.type === 'checkbox') {
                this._state[data.id] = data.defaultValue || []
            } else {
                this._state[data.id] = data.defaultValue || ''
            }
        })
    }

    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    onSubmit() {
        return this._state
    }

    setState(updateObj = {}) {
        this._state = {
            ...this._state,
            ...updateObj
        }
        this.render(updateObj)
    }

    render(updateObject = {}) {
        if (updateObject && Object.keys(updateObject).length) {
            Object.keys(updateObject).forEach(nodeId => {
                if (!nodeId.split('-').includes('error')) {
                    let currentNode = this._shadow.querySelector(`#${nodeId}`)
                    let currentErrorNode = this._shadow.querySelector(`#${nodeId}-error`)
                    const { field: _field, errorField } = this.renderField(this._metaData.find(field => field.id === nodeId))
                    currentNode.parentNode.replaceChild(_field, currentNode)
                    currentErrorNode.parentNode.replaceChild(errorField, currentErrorNode)
                }
            })
        } else {
            this._shadow.innerHTML = ''
            this.createFields()
        }
    }

    deleteProperty(object, key) {
        delete object[key]
        return object
    }

    set genericFieldValidator(fn) {
        return this._genericFieldValidator = fn
    }

    validation(event, field) {

        var path = event.path || (event.composedPath && event.composedPath());
        const evt = path[0]
        this.deleteProperty(this._state, `${field.id}-error`)
        const updateObj = { [evt.id]: evt.value }
        const validationFunc = this._genericFieldValidator || field.validation
        if (!!validationFunc) {
            let validationRes = validationFunc({ target: evt }, field)
            if (typeof validationRes === 'object') {
                this.setState({ ...validationRes, ...updateObj })
            } else {
                this.setState(updateObj)
            }
        } else {

            if (typeof updateObj[evt.id] === 'string' && !updateObj[evt.id].trim().length && field.required) {
                updateObj[`${evt.id}-error`] = `${field.label || 'Field'} is required`
            }
            this.setState(updateObj)
        }

    }

    createFields() {
        //create a div set the form content based on meta-data
        const formRoot = createNode('div')
        this._metaData.map(field => {
            const { field: _field, errorField } = this.renderField(field)
            append(formRoot, _field)
            append(formRoot, errorField)
        })

        //update(set) the slot attribute of formRoot div to reflect the name attribute of slot used in template
        append(this._shadow, formRoot)
    }

    renderField(field) {
        let _field = createNode(field.HTMLNode || 'input')
        if (_field.tagName === 'INPUT') {
            if ((_field.type = field.type || 'text') === 'checkbox') {
                _field = createNode('div')
                this.createCheckbox(_field, field)
            } else if ((_field.type = field.type || 'text') === 'radio') {
                _field = createNode('div')
                this.createRadioButton(_field, field)
            } else {
                !!field.placeholder && (_field.placeholder = field.placeholder)
            }
        } else {
            if (_field.tagName === 'SELECT') {
                this.createSelect(_field, field)
            }
        }
        _field.id = field.id
        _field.value = this._state[field.id]
        !!field.classList && (_field.classList.add(`'${field.classList.split(',').join("','")}'`))
        _field.style = field.style

        this.appendHTMLNodeAttributes(_field, field.HTMLNodeAttributes)
        _field.addEventListener('change', (e) => this.validation(e, field))
        let _errorField = createNode('p')
        _errorField.id = `${field.id}-error`
        _errorField.style = `color: red; font-size: 10px; padding: 0px;margin: 5px 0px; text-align; left`
        _errorField.innerHTML = this._state[`${field.id}-error`] || ''

        return { field: _field, errorField: _errorField }
    }

    appendHTMLNodeAttributes(node, attributeObject) {
        if (attributeObject && typeof attributeObject === 'object' && Object.keys(attributeObject).length) {
            Object.keys(attributeObject).forEach(attribute => {
                node[attribute] = attributeObject[attribute]
            })
        }
        return node
    }

    createCheckbox(parent, field) {
        if (field.options && field.options.length) {
            field.options.forEach(opt => {
                let checkboxRootSpan = createNode('span')
                !!opt.style && (checkboxRootSpan.style = opt.style)
                let checkbox = createNode('input');
                checkbox.type = "checkbox";
                checkbox.name = opt.id;
                checkbox.value = opt.id;
                checkbox.id = opt.id;
                if (this._state[field.id].includes(opt.id)) {
                    checkbox.setAttribute('checked', true)
                }
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    let newValue = []
                    if (this._state[field.id].includes(opt.id)) {
                        newValue = this._state[field.id].filter(val => val !== opt.id)
                        checkbox.setAttribute('checked', false)
                    } else {
                        newValue = this._state[field.id]
                        newValue.push(opt.id)
                        checkbox.setAttribute('checked', true)
                    }
                    this.setState({ [field.id]: newValue })

                })

                let label = createNode('label')
                label.htmlFor = opt.id;
                label.appendChild(document.createTextNode(opt.label));

                append(checkboxRootSpan, checkbox)
                append(checkboxRootSpan, label)
                append(parent, checkboxRootSpan)
            })
        } else {
            return null
        }

    }

    createRadioButton(parent, field) {
        if (field.options && field.options.length) {
            field.options.forEach(opt => {
                let radioButtonSpan = createNode('span')
                !!opt.style && (radioButtonSpan.style = opt.style)
                let radio = createNode('input');
                radio.type = "radio";
                radio.name = opt.id;
                radio.value = opt.id;
                radio.id = opt.id;
                if (this._state[field.id] === radio.value) {
                    radio.setAttribute('checked', true)
                }
                radio.addEventListener('change', (e) => {
                    e.stopPropagation();
                    let path = e.path || (e.composedPath && e.composedPath());
                    const newValue = path[0].value
                    if (newValue === radio.value) {
                        radio.setAttribute('checked', true)
                    } else {
                        radio.setAttribute('checked', false)
                    }
                    this.setState({ [field.id]: newValue })
                })

                let label = createNode('label')
                label.htmlFor = opt.id;
                label.appendChild(document.createTextNode(opt.label));

                append(radioButtonSpan, radio)
                append(radioButtonSpan, label)
                append(parent, radioButtonSpan)
            })
        } else {
            return null
        }
    }

    createSelect(parent, field) {
        if (field.options && field.options.length) {
            field.options.forEach((opt, idx) => {
                let selectOption = createNode('option')
                !!opt.style && (selectOption.style = opt.style)
                selectOption.value = opt.id;
                selectOption.id = opt.id;
                selectOption.innerHTML = opt.label;
                if (this._state[field.id] === selectOption.value) {
                    field.selectedIndex = idx
                }
                selectOption.addEventListener('input', (e) => {
                    e.stopPropagation();
                    let path = e.path || (e.composedPath && e.composedPath());
                    const newValue = path[0].value
                    field.selectedIndex = idx
                    this.setState({ [field.id]: newValue })
                })

                append(parent, selectOption)
            })
        } else {
            return null
        }
    }
}
customElements.define('form-builder', FormBuilder);