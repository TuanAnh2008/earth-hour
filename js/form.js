
export default class Form {
    #data;
    #fileURL
    inpSelected = false;
    #formParent;
    #formBtn;
    isFormValid = true
    #checkAllInp = [];
    #rulesData = {
        firstName: ['#inp-first-name', this.validateLength],
        lastName: ['#inp-last-name', this.validateLength],
        email: ['#inp-email', this.validateEmail],
        phone: ['#inp-phone', this.validateLength],
        postcode: ['#inp-postcode', this.validateLength],
        groupSelect: '',
        nameGroup: ['#inp-name-work', this.validateLength],
        file: ''
    }
    constructor(selector, succesMsg, errormsg) {
        this.#formParent = selector;
        this.showSuccessToast = succesMsg; // toast message
        this.showErrorToast = errormsg; // toast message
        const formParent = document.querySelector(this.#formParent);
        if(!formParent) return;
        const formEl = formParent.querySelector('.form');
        const formBtn = formParent.querySelector('.form-btn');
        const selectInp = formEl.querySelector('#inp-select');
        // const postcodeInp = formEl.querySelector('#inp-postcode');
        this.checkRegisterNumber(formParent); // fetch data from server and add number register
        this.inpSelectHandle(); // inp value is invidual or not
        selectInp.addEventListener('change', () => {this.inpSelectHandle.call(this);});
        const fileInp = formEl.querySelector('#inp-file');
        fileInp.addEventListener('change', this.inpFileHandle.bind(this)); // input file

        // Validate when user click btn
        formBtn.addEventListener('click', this.validateForm.bind(this))
    }

    validateForm(e) {
        e.preventDefault();
        this.#checkAllInp = []; // reset check inputs
        const validateArr = Object.values(this.#rulesData);
        validateArr.forEach(el => {
            if(Array.isArray(el)) { 
                const inp = document.querySelector(el[0]);
                switch (el[0]) {
                    case '#inp-phone':
                        el[1] === this.validateLength && el[1].call(this, inp, 10, 10)
                        break;
                
                        case '#inp-name-work':
                           this.inpSelected &&  el[1] === this.validateLength && el[1].call(this, inp, 1, 20);
                        break;

                        case '#inp-postcode':
                            el[1] === this.validateLength && el[1].call(this, inp, 3, 10);
                        break;

                    default:
                        el[1] === this.validateLength && el[1].call(this, inp, 2, 15); // call function (length)
                        break;
                }
                el[1] === this.validateEmail && el[1].call(this, inp); // (email)
            }
        });

        //  DATA
        const inpFile =  document.querySelector('#inp-file');
        inpFile.files[0] && this.#checkAllInp.push(true);
        this.getData();
        // this.resetInp();
    }

    validateLength(inp, minLength, maxLength) {
        const message =  minLength === maxLength ?  `Only ${maxLength} ${minLength === 1 || maxLength === 1 ? 'character' : 'characters'}` : `Minimum ${minLength} ${minLength === 1 || maxLength === 1 ? 'character' : 'characters'}  and maximum ${maxLength}`;
        const formGroup = inp.closest('.form-group');
        const errorEl = formGroup.querySelector('.box-error');

        if(inp.value.length < minLength || inp.value.length > maxLength) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = message;
            this.#checkAllInp.push(false)
        } else {
            errorEl.style.display = 'none';
            errorEl.innerHTML = '';
            this.#checkAllInp.push(true);
        }
    }

   async validateEmail(inp) {
        const message ='Email invalid';
        const formGroup = inp.closest('.form-group');
        const errorEl = formGroup.querySelector('.box-error');
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if((regex.test(inp.value))) { // true
            let isValidEmail = true;
            errorEl.style.display = 'none';
            errorEl.innerHTML = '';
            for(let i = 0; i < this.userApiData.length; i++) {
                if(this.userApiData[i].email === inp.value.trim()) { // email exist or not
                    this.showErrorToast('Error', 'email already exists', 3000);
                    this.#checkAllInp.push(false);
                    isValidEmail = false;
                    break;
                } 
            };
            if(!isValidEmail) return;
            this.#checkAllInp.push(true);

        } else { // false
            errorEl.style.display = 'block';
            errorEl.innerHTML = message;
            this.#checkAllInp.push(false);
        }
    }

    inpSelectHandle(e) {
        const form = document.querySelector('.form');
        const selectInp = form.querySelector('#inp-select');
        let labelMessage;
        const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
        const labelSelectEl = selectInp.closest('.form-group').querySelector('.form-group__label');
        const valueInp = selectInp.value;
        for(let i = 0; i < vowels.length; i++) {
            if(selectInp.value[0].toLowerCase() === vowels[i]) {
                labelMessage = 'I am an'
                break;
            } else {
                labelMessage = 'I am a';
            }
        };
        labelSelectEl.textContent = labelMessage;


        const inpNameWork = document.querySelector('#inp-name-work');
        const inpFile = document.querySelector('#inp-file');
        if(valueInp.toLowerCase() === 'individual') {
            const formPreviewImg = document.querySelector('#form-preview-image')
            this.inpSelected = false;
            inpNameWork.closest('.form-group').style.display = 'none';
            inpNameWork.classList.add('hidden');
            inpFile.classList.add('hidden')
            inpFile.closest('.form-group').style.display = 'none';
            const postcodeInp = form.querySelector('#inp-postcode');
            selectInp.style.marginBottom = '1rem';
            postcodeInp.style.marginBottom = '1rem';


            // RESET
            inpNameWork.value = '';
            inpFile.value = '';
            formPreviewImg.removeAttribute('src');
            formPreviewImg.removeAttribute('alt');
            formPreviewImg.removeAttribute('class');

        } else {
            this.inpSelected = true;
            inpNameWork.closest('.form-group').style.display = 'inline-block';
            inpNameWork.classList.remove('hidden')
            inpFile.closest('.form-group').style.display = 'inline-block';
            inpFile.classList.remove('hidden')
            inpFile.style.marginBottom = '1.1rem';
        }


        const labelWorkEl = document.querySelector('#inp-name-work').closest('.form-group').querySelector('.form-group__label');
        labelWorkEl.textContent = `Name of the ${valueInp.toLowerCase()}`;
        if(!e) return;
        if(!e?.target) return;
        // this.#checkAllInp.push(true);
    }

    inpFileHandle() {
        const inpFile = document.querySelector('#inp-file');
        if(!inpFile.files[0]) return;
        const errormsg =  document.querySelector('#form-preview-message')
        const formGroup = inpFile.closest('.form-group');
        const imgEl = formGroup.querySelector('#form-preview-image');
        if(inpFile.files[0]?.size > 1000000) {
            errormsg.innerHTML = 'Too big!';
             this.#checkAllInp.push(false);
            return;
        } else {
            errormsg.innerHTML = '';
        }
        const imgUrl = URL.createObjectURL(inpFile.files[0]);
        this.#fileURL = imgUrl
        imgEl.classList.add('form-preview-image');
        imgEl.src = `${imgUrl}`;
        imgEl.alt = 'Preview Image';
        // this.#checkAllInp.push(true);
    }

    getData() {
     const isDataTrue = this.#checkAllInp.every(item => item);
     if(!isDataTrue) {
        this.#checkAllInp = []; // if 1 items is false, then array will be empty and false
        this.showErrorToast('Fail', 'Registration failed! Please try again', 3000)
        return;
     }
     
     const checkInpLength = this.#checkAllInp.length;
     let data;
     const formParent = document.querySelector(this.#formParent);
     const inpFirstName = formParent.querySelector('#inp-first-name');
     const inpLastName = formParent.querySelector('#inp-last-name');
     const inpEmail = formParent.querySelector('#inp-email');
     const inpPhone = formParent.querySelector('#inp-phone');
     const inpPostcode = formParent.querySelector('#inp-postcode');
     const inpSelect = formParent.querySelector('#inp-select');
     const inpNameWork = formParent.querySelector('#inp-name-work');
     const inpFile = formParent.querySelector('#inp-file');
     // 5 6 7
     switch (checkInpLength) {
         case 5:
             data = {
                 firstName: inpFirstName.value.trim(),
                 lastName: inpLastName.value.trim(),
                 email: inpEmail.value.trim(),
                 phone: Number(inpPhone.value.trim()),
                 postcode: Number(inpPostcode.value.trim()),
                 group: inpSelect.value.trim(),
                }
                this.#data = data;
            break;

        case 6:
            data = {
                firstName: inpFirstName.value.trim(),
                lastName: inpLastName.value.trim(),
                email: inpEmail.value.trim(),
                phone: Number(inpPhone.value.trim()),
                postcode: Number(inpPostcode.value.trim()),
                group: inpSelect.value.trim(),
                nameWork: inpNameWork.value.trim(),
               }
               this.#data = data;
            break;

        case 7:
            data = {
                firstName: inpFirstName.value.trim(),
                lastName: inpLastName.value.trim(),
                email: inpEmail.value.trim(),
                phone: Number(inpPhone.value.trim()),
                postcode: Number(inpPostcode.value.trim()),
                group: inpSelect.value.trim(),
                nameWork: inpNameWork.value.trim(),
                file: this.#fileURL,
               }
               this.#data = data;
            break;
     
        default:
            break;
     };
    //  const postData = this.#data;
     // POST DATA
     (async () => {
        const responce = await fetch('https://earth-hour.onrender.com/users', {
            method: 'POST',
            headers: {'Content-type': "application/json"},
            body: JSON.stringify(this.#data)
        });
        const data = await responce.json();
         // if post success than will fetch again and add again number of register
        this.checkRegisterNumber(document.querySelector(this.#formParent));
        this.showSuccessToast('Success', 'Your account has been created', 3000)
        this.resetInp(); // reset input value

        // localstorage current user id
        localStorage.setItem('user', JSON.stringify([true, data.id]))
     })();
    }

    resetInp() {
        const inpFile = document.querySelector('#inp-file');
        const formPreviewImg = document.querySelector('#form-preview-image')
        const formParent = document.querySelector(this.#formParent);
        formParent.querySelectorAll('input').forEach(inp => inp.value = '');    
        inpFile.value = '';
        formPreviewImg.removeAttribute('src');
        formPreviewImg.removeAttribute('alt');
        formPreviewImg.removeAttribute('class');
    }

    // Number register
    async checkRegisterNumber(formParent) {
    try {
        const registerNumberEl = formParent.querySelector('.sign-up__user-number');
        const responce = await fetch('https://earth-hour.onrender.com/users');
        const data = await responce.json();
        registerNumberEl.textContent = data.length;
        this.userApiData = data;
    } catch(err) {
        console.log(err);
    }
    }
};


// soon: toobigsizebugonchangeinput