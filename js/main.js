"use strict";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const authButton = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeButton = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const buttonOut = document.querySelector('.button-out');
const userName = document.querySelector('.user-name');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

const getData = async function(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
        Статус ошибки ${response.status}!`);
  }
  return await response.json();
}

function validName(str) {
  const  regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

console.log(validName('Maks'))

function clearForm() {
  loginInput.style.borderColor = '';
  loginInput.value = ''
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  clearForm()
  modalAuth.classList.toggle('is-open');
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
    } else {
      enableScroll();
    }
}

function authorized() {
  function logout(){
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonOut.style.display = '';
    userName.textContent = '';
    authButton.style.display = '';
    buttonOut.removeEventListener('click', logout);
    checkAuth();
  }

  console.log('Авторизован');
  authButton.style.display = 'none';
  buttonOut.style.display = 'block';
  userName.style.display = 'inline-block';
  userName.textContent = login;
  buttonOut.addEventListener('click', logout);
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(ev) {
    ev.preventDefault();
    if (validName(loginInput.value)) {
      login = loginInput.value.trim();
      localStorage.setItem('gloDelivery', login);
      console.log(login);
      toggleModalAuth();
      authButton.removeEventListener('click', toggleModalAuth);
      closeButton.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();

    } else  {
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
    }    
  }

  authButton.addEventListener('click', toggleModalAuth);
  closeButton.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function(event) {
    if (event.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  })
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(restaurant) {
  const { image, 
    kitchen, 
    name, 
    price, 
    stars, 
    time_of_delivery: timeOfDelivery, 
    products } = restaurant;

  const card = `<a class="card card-restaurant" data-products="${products}">
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>      
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>      
    </div>    
    </a>`;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood({ id, description, name, price, image }) {
  const card = document.createElement('section');

  card.className = 'card'
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div> 
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      cardsMenu.textContent = '';
       
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(element => {
          createCardGood(element);
        })  
      });       
    };
  } else {
    toggleModalAuth();
  }
}

function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(element => {
      createCardRestaurant(element);
    });  
  });

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  checkAuth();


  //Slider
  new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
      shadow: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
  });
}

init();