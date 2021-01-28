$(document).ready(() => {
  // close search btn
  $(".close-btn").click(function () {
    // $(".search-item").removeClass("hide");
    if ($(this).hasClass("fa-search")) {
      $(this).removeClass("fa-search").addClass("fa-times");
      $(".search-item").removeClass("hide");
    } else {
      $(this).removeClass("fa-times").addClass("fa-search");
      $(".search-item").addClass("hide");
    }
  });

  // sticky header
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 180) {
      $(".stick").addClass("stickey-header");
      // $('nav div').addClass('visible-title');
    } else {
      $(".stick").removeClass("stickey-header");
      // $('nav div').removeClass('visible-title');
    }
  });
  //cart
  let cart = [];
  let buttonsDom = [];
  let cartTotal = document.querySelector(".cart__total");
  let cartItem = document.querySelector(".bigcounter");
  let CartContent = document.querySelector("#cartContent");
  // get all products
  class Products {
    async getProducts() {
      try {
        let results = await fetch("products.json");
        let jsonData = await results.json();
        let products = jsonData.items;
        return products;
      } catch (error) {
        console.log(error);
      }
    }
  }
  // local storarge
  class Storage {
    static saveProducts(products) {
      localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
      let products = JSON.parse(localStorage.getItem("products"));
      console.log(products);
      return products.find(product => product.sys.id === id);
    }
    static saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }

  //display the products
  class UI {
    displayProduts(products) {
      console.log(products);
      let results = "";
      products.forEach(product => {
        results += `<div class="slider_container">
        <img class="img-1 slider-img" src="${product.fields.image.url}" />
        <div class="carousel-img-des">
          <a class="details">
            ${product.fields.title}
          </a>
          <span class="price">
            $${product.fields.price}
          </span>
          <i class="fas fa-shopping-bag bag-icon"  data-id="${product.sys.id}"></i> 
        </div>
      </div>`;
        $(".carouselbox1").html(results);
      });
      function showMoviesData1() {
        scrollPerClick1 = document.querySelector(".img-1").clientWidth + 20;
      }
      showMoviesData1();
    }
    getBagBtn() {
      const btns = [...document.querySelectorAll(".bag-icon")];
      buttonsDom = btns;
      btns.forEach(button => {
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if (inCart) {
          button.innerText = "in Cart";
          button.disabled = true;
        } else {
          button.addEventListener("click", e => {
            e.target.innerText = "In Cart";
            e.target.disabled = true;
            //get propduct from products
            let cartItem = { ...Storage.getProduct(id), amount: 1 };
            console.log(cartItem);
            //add product to the cart
            cart = [...cart, cartItem];
            console.log(cart);
            //save cart in local storage
            Storage.saveCart(cart);
            //set set cart values
            this.seCartValues(cart);
            //display cart item
            this.addCartItem(cartItem);
            //show the cart
          });
        }
      });
    }
    seCartValues(cart) {
      let temTotal = 0;
      let itemsTotal = 0;
      cart.map(item => {
        console.log(item);
        temTotal += item.fields.price * item.amount;
        itemsTotal += item.amount;
      });
      cartTotal.innerText = parseFloat(temTotal.toFixed(2));
      cartItem.innerText = itemsTotal;
      console.log(cartTotal, cartItem);
    }
    addCartItem(item) {
      const div = document.createElement("div");
      div.classList.add("container-fluid");
      div.innerHTML = `
      <div class="row">
      <div class="col-6">
        <img src="${item.fields.image.url}" class="img-fluid" alt="${item.fields.title}">
      </div>
      <div class="col-6 flower-modal-desc">
      <div class="cart-modal-header">
        <h5>${item.fields.title}</h5>
        <span class="remove-item" data-id="${item.sys.id}">X</span>
      </div>
        <div class="cart-modal-price">
          <h5>price:</h5><span>$${item.fields.price}</span>          
        </div>
        <div class="cart-modal-amount">
          <h5>amount</h5>
          <div class="up-down">
            <i class="fas fa-chevron-up" data-id=${item.sys.id}></i>
            <p class ="item-amount" >${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.sys.id}></i>
          </div>
        </div>
      </div>
    </div>
      `;
      CartContent.appendChild(div);
    }
  }

  const ui = new UI();
  const products = new Products();
  // get all products
  products
    .getProducts()
    .then(product => {
      ui.displayProduts(product);
      Storage.saveProducts(product);
    })
    .then(() => {
      ui.getBagBtn();
    });

  // Slider
  $(".switchLeft").click(sliderScrollLeft1);
  $(".switchRight").click(sliderScrollRight1);
  const sliders1 = document.querySelector(".carouselbox1");
  var scrollPerClick1;
  var ImagePadding = 20;

  // Scroll Functionality
  var scrollAmount1 = 0;

  function sliderScrollLeft1() {
    sliders1.scrollTo({
      top: 0,
      left: (scrollAmount1 -= scrollPerClick1),
      behavior: "smooth",
    });

    if (scrollAmount1 < 0) {
      scrollAmount1 = 0;
    }

    console.log("Scroll Amount: ", scrollAmount1);
  }

  function sliderScrollRight1() {
    if (scrollAmount1 <= sliders1.scrollWidth - sliders1.clientWidth) {
      sliders1.scrollTo({
        top: 0,
        left: (scrollAmount1 += scrollPerClick1),
        behavior: "smooth",
      });
    }
    console.log("Scroll Amount: ", scrollAmount1);
  }
});
