# form-builder
VanillaJS based Form Builder to dynamically generate form fileds.

## Local Setup
 - Unzip the folder
 - In the project directory, open `index.html` in web-browser
 
#### Note
 - Here, single scripts/index.js file contains all the form-builder components. 
 - However, same can be broken down into modules and can be imported individually. 
 - createCheckbox.js is created specifically to display this use case. It needs to be imported as `import createCheckbox from './createCheckbox.js'` in main `index.js`
 - But ES6 modules are served with file:// protocol(when running locally) and same does not support same-origin policy, causing CORS issue. 
 - To make this work, `*.js` files need to be hosted on a server(local or cloud). For simplicity, that is not covered as part of this assignment.

## Sample JSON metaData
[
            {
                id: 'name',
                label: 'Name',
                HTMLNode: 'input',
                type: 'text',
                placeholder: 'Enter Name',
                // validation: customValidation,
                style: 'padding: 10px; color: green; width: 50%',
                required: true
            },
            {
                id: 'dob',
                label: 'Date of Birth',
                HTMLNode: 'input',
                type: 'date',
                placeholder: 'Input date',
                style: 'padding: 10px; color: green; width: 50%',
                // validation: customValidation
                required: true
            },
            {
                id: 'password',
                label: 'Password',
                HTMLNode: 'input',
                type: 'password',
                placeholder: 'Enter Password',
                style: 'padding: 10px; color: green; width: 50%',
                required: true
                // validation: customValidation
            },
            {
                id: 'address',
                label: 'Address',
                HTMLNode: 'textarea',
                type: 'text',
                placeholder: 'Enter Address',
                style: 'padding: 10px; color: green;',
                HTMLNodeAttributes: {
                    rows: '4',
                    cols: '77'
                },
                required: true
                // validation: customValidation
            },
            {
                id: 'file',
                label: 'Upload File',
                HTMLNode: 'input',
                type: 'file',
                placeholder: 'Upload File',
                style: 'padding: 10px; color: green; width: 50%;',
                required: true
                // validation: customValidation
            },
            {
                id: 'language',
                label: 'Language',
                HTMLNode: 'input',
                type: 'checkbox',
                // validation: customValidation,
                style: 'padding: 10px; color: green; width: 50%;display: flex;',
                options: [
                    {
                        id: 'hindi',
                        label: 'Hindi',
                        style: 'padding: 10px; margin: 5px'
                    },
                    {
                        id: 'english',
                        label: 'English',
                        style: 'padding: 10px; margin: 5px'
                    },
                    {
                        id: 'tamil',
                        label: 'Tamil',
                        style: 'padding: 10px; margin: 5px'
                    }
                ]
                // required: true
            },
            {
                id: 'gender',
                label: 'Gender',
                HTMLNode: 'input',
                type: 'radio',
                // validation: customValidation,
                style: 'padding: 10px; color: green; width: 50%;display: flex;',
                options: [
                    {
                        id: 'male',
                        label: 'Male',
                        style: 'margin: 5px'
                    },
                    {
                        id: 'female',
                        label: 'Female',
                        style: 'margin: 5px'
                    },
                    {
                        id: 'other',
                        label: 'Other',
                        style: 'margin: 5px'
                    }
                ]
                // required: true
            },
            {
                id: 'car',
                label: 'Select Car',
                HTMLNode: 'select',
                style: 'padding: 10px; color: green; width: 50%;display: flex;',
                options: [
                    {
                        id: '',
                        label: 'Select One',
                        style: 'margin: 5px'
                    },
                    {
                        id: 'tata-indica',
                        label: 'Tata Indica',
                        style: 'margin: 5px'
                    },
                    {
                        id: 'mahindra-scorpio',
                        label: 'Mahindra Scorpio',
                        style: 'margin: 5px'
                    },
                    {
                        id: 'maruti-wagonr',
                        label: 'Maruti WagonR',
                        style: 'margin: 5px'
                    }
                ]
                // required: true
            },
        ]