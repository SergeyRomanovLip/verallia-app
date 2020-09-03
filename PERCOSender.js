const state = new State()
const $root = new Root()
const $footer = new Footer()
const $header = new Header()
const $request = new Request()
const $perco = new PERCOForm()
const $recaptcha = new Recaptcha()

$header.createHeader(
    'Добрый день!',
    'Заполните поля ниже для отправки заявки на пропуск посетителей'
)
$perco.makePECROForm()