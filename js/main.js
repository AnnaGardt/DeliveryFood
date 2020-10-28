const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day1

const authButton = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeButton = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')
const buttonOut = document.querySelector('.button-out')
const userName = document.querySelector('.user-name')

let login = localStorage.getItem('gloDelivery')


function toggleModalAuth() {
  modalAuth.classList.toggle('is-open')
}

function authorized() {
  function logout(){
    login = null
    localStorage.removeItem('gloDelivery')
    buttonOut.style.display = ''
    userName.textContent = ''
    authButton.style.display = ''
    buttonOut.removeEventListener('click', logout)
    checkAuth()
  }

  console.log('Авторизован')
  authButton.style.display = 'none'
  buttonOut.style.display = 'block'
  userName.style.display = 'inline-block'
  userName.textContent = login
  buttonOut.addEventListener('click', logout)
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(ev) {
    ev.preventDefault()
    login = loginInput.value.trim()
    if (login === '') {
      loginInput.style.border = '1px solid red';
      loginInput.addEventListener('change', function (){
        loginInput.style.border = ''
      })
      return;
    }
    localStorage.setItem('gloDelivery', login)
    console.log(login)
    toggleModalAuth()
    authButton.removeEventListener('click', toggleModalAuth)
    closeButton.removeEventListener('click', toggleModalAuth)
    logInForm.removeEventListener('submit', logIn)
    logInForm.reset()
    checkAuth()
  }

  authButton.addEventListener('click', toggleModalAuth)
  closeButton.addEventListener('click', toggleModalAuth)
  logInForm.addEventListener('submit', logIn)
}

function checkAuth(){
  if (login) {
    authorized()
  } else {
    notAuthorized()
  }
}

checkAuth()