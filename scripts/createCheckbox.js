const createCheckbox = (context, parent, field) =>{
    if (field.options && field.options.length) {
        field.options.forEach(opt => {
            let checkboxRootSpan = createNode('span')
            !!opt.style && (checkboxRootSpan.style = opt.style)
            let checkbox = createNode('input');
            checkbox.type = "checkbox";
            checkbox.name = opt.id;
            checkbox.value = opt.id;
            checkbox.id = opt.id;
            if (context._state[field.id].includes(opt.id)) {
                checkbox.setAttribute('checked', true)
            }
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                console.log('field: ', field, 'opt: ', opt, 'state: ', context._state)
                let newValue = []
                if (context._state[field.id].includes(opt.id)) {
                    newValue = context._state[field.id].filter(val => val !== opt.id)
                    checkbox.setAttribute('checked', false)
                } else {
                    newValue = context._state[field.id]
                    newValue.push(opt.id)
                    checkbox.setAttribute('checked', true)
                }
                console.log('new val: ', newValue)
                context.setState({ [field.id]: newValue })

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

export default createCheckbox