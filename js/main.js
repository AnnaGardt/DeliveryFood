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
const containerPromo = document.querySelector('.swiper-container');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

const restaurantRating = document.querySelector('.rating');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');

const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');
let cart = [];

(JSON.parse(localStorage.getItem('cartItems'))) ? cart = JSON.parse(localStorage.getItem('cartItems')) : cart = [];

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
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logout);
    checkAuth();
  }

  console.log('Авторизован');
  authButton.style.display = 'none';
  buttonOut.style.display = 'flex';
  userName.style.display = 'inline';
  cartButton.style.display = 'flex';
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
  const { image, kitchen, name, price, stars, time_of_delivery: timeOfDelivery, products } = restaurant;

    const cardRestaurant = document.createElement('a');
    cardRestaurant.classList = 'card card-restaurant';
    cardRestaurant.products = products;
    cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
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
    </div>`;

    cardRestaurant.insertAdjacentHTML('beforeend', card);
    cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function createCardGood({ id, description, name, price, image }) {
  const card = document.createElement('section');

  card.className = 'card';
  card.id = id;
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt=${image} class="card-image" />
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
        <strong class="card-price card-price-bold">${price} ₽</strong>
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
      const { kitchen, name, price, stars } = restaurant.info; 

      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      restaurantCategory.textContent = kitchen;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantRating.textContent = stars;

      cardsMenu.textContent = '';
       
      getData(`./db/${restaurant.products}`).then(function(data){
        data.forEach(element => {
          createCardGood(element);
        })  
      });       
    };
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const coast = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find(function(item){
      return item.id === id;
    })

    if (food) {
      food.count += 1
    } else {
      cart.push({id, title, coast, count: 1});
      localStorage.setItem('cartItems', JSON.stringify(cart)); 
    }    
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title, coast, count}){
    const itemCart = `<div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${coast}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>`;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });
  const totalPrice = cart.reduce(function(result, item){
    return result + (parseFloat(item.coast))*item.count;
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count -=1 ;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) {food.count+=1}; 
    renderCart();
    localStorage.setItem('cartItems', JSON.stringify(cart)); 
  }   
}

function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(element => {
      createCardRestaurant(element);
    });  
  });

  buttonClearCart.addEventListener('click', function(){
    cart.length = 0;
    localStorage.setItem('cartItems', JSON.stringify(cart)); 
    renderCart();
  })

  modalBody.addEventListener('click', changeCount);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  inputSearch.addEventListener('keypress', function(event){
    if (event.charCode === 13) {
      const value = event.target.value.trim();
      if (!value) {
        event.target.style.backgroundColor = 'red';
        event.target.value = '';
        setTimeout(function(){event.target.style.backgroundColor = '';}, 1500);
        return;
      }
      getData('./db/partners.json')
      .then(function (data) {
        return data.map(function(partner) {
          return partner.products;
        });
      })
      .then(function (linkProducts) {
        cardsMenu.textContent = '';
        linkProducts.forEach(function(link) {
          getData(`./db/${link}`)
            .then(function(data){

              const resultSearch = data.filter(function(item){
                const name = item.name.toLowerCase()
                return name.includes(value.toLowerCase());
              })
              
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              restaurantTitle.textContent = 'Результат поиска';
              restaurantCategory.textContent = '';
              restaurantPrice.textContent = '';
              restaurantRating.textContent = '';    
              resultSearch.forEach(createCardGood)          
            })
        })
      })
    };
  })

  cardsMenu.addEventListener('click', addToCart);

  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });

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