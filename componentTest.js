class State {
    constructor() {
        this.state = {
            owner: '',
            location: '',
            questionList: {},
            answers: {},
            toggled: '',
        }
    }
    removeSt(place, id) {
        if (Object.keys(this.state[place]).indexOf(id)) { }
        delete this.state[place][id]
        this.updateSt()
    }
    addSt(place, el, id) {
        if (id) {
            if (this.state[place]) {
                this.state[place][id] = el
            } else {
                this.state[place] = {}
                this.state[place][id] = el
            }
        } else {
            if (this.state[place]) {
                this.state[place] = el
            } else {
                this.state[place] = {}
                this.state[place] = el
            }
        }

        this.updateSt()
    }
    initializationSt() {
        const localState = localStorage.getItem('state')
        if (localState.location == '') {
            localStorage.setItem(
                'state',
                JSON.stringify(this.state)
            )
        } else {
            this.state = JSON.parse(localState)
        }
    }
    updateSt() {
        let newState = JSON.stringify(this.state)
        Object.keys(this.state).map(() => {
            localStorage.setItem('state', newState)
        })
    }
    percoAddData(key, value) {
        this.state.PERCOrequest[key] = value
    }
    get questionList() {
        return this.state.questionList
    }
    get toggled() {
        return this.state.toggled
    }
    get owner() {
        return this.state.owner
    }
    get location() {
        return this.state.location
    }
    get answers() {
        return this.state.answers
    }
    set toggled(value) {
        this.state.toggled = value
    }
}

class Root {
    constructor() {
        this.app = document.querySelector('#app')
        this.loader = {
            node: {},
            on: () => {
                let loader = this.newElement(
                    'div',
                    'loader', ['lds-ring', 'active'],
                    `
              <div></div>
              <div></div>
              <div></div>
              <div></div>`
                )
                this.loader.node = loader
            },
            off: () => {
                setTimeout(() => {
                    this.loader.node.remove()
                }, 500)
            }
        }
    }
    parseLocalData(data) {
        try {
            JSON.parse(data)
            return JSON.parse(data)
        } catch (err) {
            return null
        }
    }

    newElement(
        type = 'div',
        id = '',
        classes = [],
        data = '',
        dataset = '',
        parent = ''
    ) {
        const $el = document.createElement(type)
        $el.id = id
        classes.map(el => {
            $el.className += ` ${el}`
        })
        $el.classList.add('deactivated')
        $el.innerHTML = data
        dataset
            ?
            ($el.dataset[dataset[0]] = dataset[1]) :
            $el.dataset
        // $root.nodes[id] = $el
        if (parent) {
            const parentNode = document.querySelector(parent)
            parentNode.appendChild($el)
            console.log(`${$el.id} был добавлен в ${parent}`)
        } else {
            app.appendChild($el)
            console.log(`${$el.id} был добавлен в $root`)
        }
        setTimeout(() => {
            $el.classList.remove('deactivated')
            $el.classList.add('activated')
        }, 300)
        return $el
    }

    removeElement(el) {
        el.classList.remove('activated')
        el.classList.add('deactivated')
        setTimeout(() => {
            el.remove()
            // delete el
        }, 300)
    }

    request(url, data) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest()
            req.open('post', url)
            req.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
            )
            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response)
                } else {
                    reject(Error(req.statusText))
                }
            }
            req.onerror = function () {
                reject(Error('Network Error'))
            }
            req.send(data)
        })
    }

    alert(data) {
        const $alert = $root.newElement(
            'div',
            'alert', ['modal'],
            `
        <div class='alert-body'>
        <div class='alert-body-text'>
        ${data}
        </div>
        <div id='alert-body-button' class='alert-body-button' data-type='alert'>
        Закрыть
        </div>
        </div>
        `
        )
        $alert.addEventListener('click', function (e) {
            if (e.target.dataset.type == 'alert') {
                this.remove()
            }
        })

    }

    login() {
        this.newElement(
            'div',
            'authForm', ['modal'],
            `
    <div id='authForm' class='modal'>
    <div class='auth'>
      <div class='auth-header'>
      Войти в систему Kamishibai Audits</div>
      <div class='auth-body'>
        <div class='auth-body-form'>
          <p class='auth-body-form-label'>Укажите ваш логин</p>
          <input
            id='authUserInput'
            type='text'
            class='auth-body-form-input'
            id='user'
            placeholder='логин'
          />
        </div>
        <div class='auth-body-form'>
          <p class='auth-body-form-label'>Укажите пароль</p>
          <input
            id='authPasswordInput'
            type='password'
            class='auth-body-form-input'
            id='password'
            placeholder='пароль'
          />
        </div>
        <button
        id = 'authButton'
          type='submit'
          class='auth-button'
        >
          Войти
        </button>
      </div>
    </div>
  </div>
  `
        ).addEventListener('click', e => {
            let user = ''
            let password = ''
            if (e.target.id === 'authButton') {
                user = document.getElementById('authUserInput')
                    .value
                password = document.getElementById(
                    'authPasswordInput'
                ).value
                $request.loginReq(user, password)
            }
        })
    }
}

class QuestionList extends Root {
    makeList() {
        this.newElement('div', 'list', ['checklist-container'])
        this.newElement('ul', 'questionList', [
            'checklist-container',
        ])
        for (let id in state.questionList) {
            let element = $root.newElement(
                'li',
                id, ['checklist-container-unit'],
                `<div class="checklist-container-unit-toolbar">
        <div class="checklist-container-unit-toolbar-items">
        <div class="checklist-container-unit-toolbar-items-text" data-type='questiontext' contenteditable="true"></div>
        </div> 
        </div>
        <div class='checklist-container-unit-question' data-type='unitQuestion'>
                            ${state.questionList[id].question}
        </div>
                        
        <div class='checklist-container-unit-btngrp'>
        <div id='yes-${id}' class="checklist-container-unit-button yes" data-questionid='${id}' data-type='questionbtn' data-btntype='yes' data-text='${state.questionList[id].question}' data-location='${state.questionList[id].location}' data-typeaudit='${state.questionList[id].type}'>
        Да
        </div>
        <div id='no-${id}'class="checklist-container-unit-button no" data-questionid='${id}' data-type='questionbtn' data-btntype='no' data-text='${state.questionList[id].question}' data-location='${state.questionList[id].location}' data-typeaudit='${state.questionList[id].type}'>
        Нет
        </div>
        </div>`, ['type', 'question'],
                '#list'
            )
            element.addEventListener('click', e => {
                if (e.target.dataset.type == 'questionbtn') {
                    this.doneQuestion(e, id)
                }
            })
            element.addEventListener('click', e => {
                if (
                    e.target.dataset.type != 'questionbtn' &&
                    e.target.dataset.type != 'questiontext'
                ) {
                    let toolbar = element.querySelector(
                        '.checklist-container-unit-toolbar'
                    )
                    toolbar.classList.toggle('opened')
                    if (
                        state.toggled != '' &&
                        state.toggled != toolbar
                    ) {
                        state.toggled.classList.remove('opened')
                        state.toggled = toolbar
                    } else {
                        state.toggled = toolbar
                    }
                }
            })
        }
    }
    doneQuestion(el, id) {
        const answeredQuestion = [
            el.target.dataset.text,
            el.target.dataset.btntype,
            el.target.dataset.location,
            el.target.dataset.typeaudit,
        ]
        $root.removeElement(id)
        state.removeSt('questionList', id)
        state.addSt(
            'answers',
            answeredQuestion,
            el.target.dataset.questionid
        )
        if (Object.keys(state.questionList).length == 0) {
            const answers = JSON.stringify(state.answers)
            $request.sendAnswerReq(answers)
        }
    }
}

class Footer extends Root {
    createFooter() {
        this.newElement(
            'div',
            'footer', ['footer'],
            `
  <div id='footer-button-exit' class='footer-button' onclick='$request.logoutRequest()'>Выход</div>
   <div id='footer-button' class='footer-button' onclick='location.reload()'>Обновить</div>`
        ).addEventListener('click', e => {
            if (e.target.id === 'footer-button-exit') {
                $request.logoutReq()
            }
        })
    }
}

class Header extends Root {
    createHeader(header1 = '', header2 = '') {
        if (header1 == '' && header2 == '') {
            this.newElement(
                'div',
                'header', ['header'],
                `
  <div class='header-bottomline'></div>
  <img class='header-img' src="./src/img/logoVerallia.jpg" alt=""/>
  <div class='header-text'
  <h3>Добрый день ${state.owner}!</h3>
  <p>Сегодня вам необходимо провести аудит на участке <strong>${state.location}</strong></p>
  </div>
  `
            )
        } else {
            this.newElement(
                'div',
                'header', ['header'],
                `
  <div class='header-bottomline'></div>
  <img class='header-img' src="./src/img/logoVerallia.jpg" alt=""/>
  <div class='header-text'
  <h2><strong>${header1}</strong></h2>
  <p>${header2}</p>
  </div>
  `
            )
        }
    }
}

class Request extends Root {
    loginReq(user, password) {
        $root
            .request(
                'https://rsvisualstudio.ru/kamishibai/backend/main.php',
                `req=login&user=${user.toLowerCase()}&password=${password}`
            )
            .then(
                result => {
                    result = result.replace(/"/g, '')
                    if (result == 'coockiesWasNotSetted') {
                        $root.alert('Вы ввели неверные данные')
                    } else {
                        $root.removeElement('authForm')
                        $root.alert('Вы авторизовались')
                        state.addSt('owner', user)
                        location.reload()
                    }
                },
                error => {
                    $root.alert(error)
                }
            )
    }
    getQuestionsReq(user) {
        let getQuestions = $root
            .request(
                'https://rsvisualstudio.ru/kamishibai/backend/main.php',
                `req=getQuestions&user=${user}`
            )
            .then(
                result => {
                    result = JSON.parse(result)
                    let resultObj = {}
                    try {
                        result.map((e, i) => {
                            resultObj[i] = e
                        })
                    } catch {
                        resultObj = result
                    }
                    return [resultObj, user]
                },
                error => {
                    $root.alert(error)
                }
            )
        return getQuestions
    }
    sendAnswerReq() {
        const answers = JSON.stringify(
            JSON.parse(localStorage.getItem('state')).answers
        )
        let send = $root
            .request(
                'https://rsvisualstudio.ru/kamishibai/backend/main.php',
                `req=insertAnswers&answers=${answers}`
            )
            .then(
                result => {
                    $root.alert(
                        'Спасибо! Вы провели аудит! На сегодня все, приходите завтра'
                    )
                    localStorage.clear()
                },
                error => {
                    $root.alert(error)
                }
            )
        return send
    }
    logoutReq() {
        let logout = $root
            .request(
                'https://rsvisualstudio.ru/kamishibai/backend/main.php',
                `req=logout`
            )
            .then(
                result => {
                    localStorage.clear()
                    location.reload()
                },
                error => {
                    $root.alert(error)
                }
            )
        return logout
    }
    checkReq() {
        let check = $root
            .request(
                'https://rsvisualstudio.ru/kamishibai/backend/main.php',
                `req=check`
            )
            .then(
                result => {
                    result = result.replace(/"/g, '')
                    return result
                },
                error => { }
            )
        return check
    }
}

class PERCOForm extends Root {
    constructor() {
        super()
        this.form = {}
        this.quantityOfGuests = 1
    }

    makePECROForm() {
        const form = this.newElement(
            'div',
            'form', ['PERCOForm'],
            `
            <div>
                Ваш e-mail:<br>
                <input id='name' type="email" size="20" > @verallia.com
            </div>

            <br>

            <div>
                Наименование компании посетителей:<Br>
                <input id='company' type="text" size="40">
            </div>

            <br>
            <div>
                Дата прибытия посетителей:<Br>
                <input id='date' type="date" size="10">
            </div>

            <br>

            <div>
            Данные посетителей:<Br>
            <ul id='guestList' class='PERCOForm-list'> 
            </ul>
            </div>
            <div>
                Причина посещения:<Br>
                <select id='select' size='1'>
                <option disabled selected></option>
                <option value="Гость без посещения территории">Гость без посещения территории</option>
                <option value="Гость с посещением территории">Гость с посещением территории</option>
                <option value="подрядчики на ознакомление">Подрядчики на ознакомление</option>
                <option value="подрядчики на работы">Подрядчики на работы</option>
                </select>
            </div>
            <br>

            <div>Комментарий<Br>
            <textarea id='comment' name="comment" cols="40" rows="1"></textarea>
            </div>
            
            <br>
            <div>
            <input id='sendData' type="submit" value="Отправить" onclick = '$perco.sendData()'>
            <input type="reset" value="Очистить" onclick = 'location.reload()'>
            </div>
            <div id='recaptcha' class="recaptcha">
            </div>

    `
        )
        this.form = {
            email: form.querySelector('#name'),
            company: form.querySelector('#company'),
            date: form.querySelector('#date'),
            cause: form.querySelector('#select'),
            comment: form.querySelector('#comment'),
            type: form.querySelector('#select'),
        }
        this.makeGuest()
        $recaptcha.renderRecaptcha()
    }

    makeGuest() {
        let id = this.quantityOfGuests
        let parent = this
        this.form[id] = new Guest(id, parent)
        this.quantityOfGuests += 1
    }

    sendData() {
        const data = {}
        const status = []
        for (let row in this.form) {
            if (row > 0 && row < 20) {
                data[row] = {
                    FIO: this.form[row].data.FIO.value,
                    birthDate: this.form[row].data.birthDate.value,
                    position: this.form[row].data.position.value,
                    picture: this.form[row].data.picture.src,
                    photoSender: this.form[row].data.photoSender.files[0],
                    photoCroppedFile: this.form[row].data.photoCroppedFile
                }
            } else {
                data[row] = this.form[row].value
            }

        }
        for (let row in data) {
            if (data[row] == '' && row != 'comment') {
                status.push('Необходимо заполнить поле ' + row)
            } else if (data[row].FIO == "") {
                status.push('Необходимо заполнить данные посетителей')
            }

        }
        if (status.length >= 1) {
            let dataForAlert = `
            <ul>
            ${status.map((el) => {
                return `<li>${el}</li>`
            })}
            </ul>
            `
            this.alert(dataForAlert)
        } else {
            this.req(data)
        }

    }

    req(data) {
        let formData = new FormData()
        let guests = {}
        for (let row in data) {
            if (row > 0 && row < 20) {
                guests[row] = {
                    id: `guest${row}`,
                    FIO: data[row].FIO,
                    birthDate: data[row].birthDate,
                    position: data[row].position,
                    photoPath: ''
                }

                let extension = data[row].photoSender.name.split('.').pop()
                formData.append(`guest${row}-photo`, data[row].photoCroppedFile.blob, `guest${row}.${extension}`)
            }
            else {
                formData.append(row, JSON.stringify(data[row]))
            }
        }

        let recaptcha = grecaptcha.getResponse()
        formData.append('guests', JSON.stringify(guests))
        formData.append('typeOfRequest', 'newRequest')
        formData.append('g-recaptcha-response', recaptcha)
        fetch('https://rsvisualstudio.ru/kamishibai/backend/PERCOSender.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                response.text().then((e) => {
                    if (e == 'captchaFalse') {
                        $root.alert('Необходимо указать что вы не робот')
                    }
                })
            })
            .catch(error => {
                console.error(error)
            })
    }

}

class Guest extends PERCOForm {
    constructor(id, parent) {
        super()
        let guest = this.newElement('li', `guest-${id}`, ['PERCOForm-guest deactivated'],
            `
            <input id='FIO' type="text" size="20" placeholder="ФИО">
            <input id='position' type="text" size="10" placeholder="Должность">
            <input id='birthDate' type="text" size="10" placeholder="Год рождения">
            <span id='addNew' class='PERCOForm-button-plus'>&nbsp+&nbsp</span>
            <span id='deleteThis' class='PERCOForm-button-minus'>&nbsp&times&nbsp</span>
            <span>
            <label class='PERCOForm-guest-inputfile-label' for='photoLoader${id}' >&nbspФото&nbsp</label>
            <input id='photoLoader${id}' type='file' class='PERCOForm-guest-inputfile' multiple accept="image/*" >
            </input>
            </span>
            <img id='photoOfGuest' class='PERCOForm-guest-photo' src='' ></img>
            `,
            '',
            '#guestList'
        )
        this.data = {
            FIO: guest.querySelector('#FIO'),
            position: guest.querySelector('#position'),
            birthDate: guest.querySelector('#birthDate'),
            picture: guest.querySelector('#photoOfGuest'),
            delete: guest.querySelector('#deleteThis').addEventListener('click', (el) => {
                guest.remove()
            }),
            add: guest.querySelector('#addNew').addEventListener('click', (el) => {
                parent.makeGuest()
            }),
            photoSender: guest.querySelector(`#photoLoader${id}`),
            photoLoader: guest.querySelector(`#photoLoader${id}`).addEventListener('change', (el) => {
                this.createPicture(el)
            }),
            photoCroppedFile: {
                blob: {}
            }
        }
    }
    createPicture(el) {
        if (el.target.files && el.target.files[0]) {
            let reader = new FileReader()
            let image = this.data.picture
            let photoCroppedFile = this.data.photoCroppedFile
            reader.onload = function (e) {
                let promise = new Promise((resolve, reject) => {
                    image.src = e.target.result
                    resolve(image)
                })
                promise.then((image) => {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext('2d')
                    ctx.canvas.width = 350;
                    ctx.canvas.height = 350;
                    let imgSize = Math.min(image.width, image.height);
                    let left = (image.width - imgSize) / 2;
                    let top = (image.height - imgSize) / 2;
                    ctx.drawImage(image, left, top, imgSize, imgSize, 0, 0, ctx.canvas.width, ctx.canvas.height);
                    let dataurl = canvas.toDataURL(el.target.files[0].type);
                    canvas.toBlob((blob) => {
                        photoCroppedFile.blob = blob
                    })
                    image.src = dataurl
                    image.style.height = '100px'
                    image.style.width = '100px'
                    image.classList.remove('deactivated')
                    image.classList.add('activated')
                })
            }
            reader.readAsDataURL(el.target.files[0])
        }
    }
}

class Recaptcha {
    renderRecaptcha() {
        window.onload = () => {
            grecaptcha.render("recaptcha", {
                sitekey: "6LcrL-gUAAAAANhVP-7NkE5Qx3WPqSuDDxkDXWAn",
                callback: function () { },
            });
        }
    }
}

function initialization() {
    $footer.createFooter()
    $request
        .checkReq()
        .then(result => {
            if (result == 'userIsNotAuthorized') {
                return $request.login()
            } else {
                return $request.getQuestionsReq(result)
            }
        })
        .then(([result, user] = ['empty', 'empty']) => {
            if (result == 'empty') {
                console.log('необходимо авторизоваться')
            } else if (result == 'todayalreadyanswered') {
                $root.alert(
                    'Вы сегодня уже проводили аудит, зайдите в приложение завтра'
                )
            } else {
                try {
                    JSON.parse(localStorage.getItem('state'))
                        .location == ''
                    if (
                        JSON.parse(localStorage.getItem('state'))
                            .location == '' ||
                        JSON.parse(localStorage.getItem('state'))
                            .location == undefined
                    ) {
                        state.addSt('questionList', result)
                        state.addSt('location', result[0].location)
                        state.addSt('owner', user)
                    } else {
                        let localState = JSON.parse(
                            localStorage.getItem('state')
                        )
                        state.addSt('answers', localState.answers)
                        state.addSt('location', localState.location)
                        state.addSt('owner', localState.owner)
                        state.addSt(
                            'questionList',
                            localState.questionList
                        )
                    }
                } catch (err) {
                    state.addSt('questionList', result)
                    state.addSt('location', result[0].location)
                    state.addSt('owner', user)
                }

                $list.makeList()
                $header.createHeader($root.state)
            }
        })
}