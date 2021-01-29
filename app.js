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
  let clearCartBtn = document.querySelector(".clear-all-btn");
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
      return products.find(product => product.sys.id === id);
    }
    static saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
      return localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    }
  }

  //display the products
  class UI {
    displayProduts(products) {
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
        let inCart = cart.find(item => item.sys.id === id);
        if (inCart) {
          button.innerText = "in Cart";
          button.disabled = true;
        } else {
          button.addEventListener("click", e => {
            if (e.target.innerHTML === "In Cart") return;
            e.target.innerText = "In Cart";
            e.target.disabled = true;
            //get propduct from products
            let cartItem = { ...Storage.getProduct(id), amount: 1 };
            //add product to the cart
            cart = [...cart, cartItem];
            //save cart in local storage
            Storage.saveCart(cart);
            //set set cart values
            this.seCartValues(cart);
            //display cart item
            this.addCartItem(cartItem);
          });
        }
      });
    }
    seCartValues(cart) {
      let temTotal = 0;
      let itemsTotal = 0;
      cart.map(item => {
        temTotal += item.fields.price * item.amount;
        itemsTotal += item.amount;
      });
      cartTotal.innerText = parseFloat(temTotal.toFixed(2));
      cartItem.innerText = itemsTotal;
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
      </div>
        <div class="cart-modal-price">
          <h5>$${item.fields.price}</h5>          
        </div>
        <div class="cart-modal-amount">
          <h5>amount</h5>
          <div class="up-down">
            <i class="fas fa-chevron-up" data-id=${item.sys.id}></i>
            <p class ="item-amount" >${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.sys.id}></i>
          </div>
        </div>
        <span class="remove-item" data-id="${item.sys.id}">remove</span>
      </div>
    </div>
      `;
      CartContent.appendChild(div);
    }
    setUpApp() {
      cart = Storage.getCart();
      this.seCartValues(cart);
      this.populateCart(cart);
    }
    populateCart(cart) {
      cart.forEach(item => this.addCartItem(item));
    }
    cartLogic() {
      clearCartBtn.addEventListener("click", () => {
        this.clearCart();
      });
      CartContent.addEventListener("click", e => {
        if (e.target.classList.contains("remove-item")) {
          let removeItem = e.target;
          let id = removeItem.dataset.id;
          CartContent.removeChild(
            removeItem.parentElement.parentElement.parentElement
          );
          this.removeItem(id);
        } else if (e.target.classList.contains("fa-chevron-up")) {
          let addAmount = e.target;
          let id = addAmount.dataset.id;
          let tempItem = cart.find(item => item.sys.id === id);
          tempItem.amount = tempItem.amount + 1;
          Storage.saveCart(cart);
          this.seCartValues(cart);
          addAmount.nextElementSibling.innerText = tempItem.amount;
        } else if (e.target.classList.contains("fa-chevron-down")) {
          let lowerAmount = e.target;
          let id = lowerAmount.dataset.id;
          let tempItem = cart.find(item => item.sys.id === id);
          tempItem.amount = tempItem.amount - 1;
          if (tempItem.amount > 0) {
            Storage.saveCart(cart);
            this.seCartValues(cart);
            lowerAmount.previousElementSibling.innerText = tempItem.amount;
          } else {
            CartContent.removeChild(
              lowerAmount.parentElement.parentElement.parentElement
                .parentElement.parentElement
            );
            this.removeItem(id);
          }
        }
      });
    }
    clearCart() {
      let carItems = cart.map(item => item.sys.id);
      carItems.forEach(id => this.removeItem(id));
      while (CartContent.children.length > 0) {
        CartContent.removeChild(CartContent.children[0]);
      }
    }
    removeItem(id) {
      cart = cart.filter(item => item.sys.id !== id);
      this.seCartValues(cart);
      Storage.saveCart(cart);
      let button = this.getSigleBtn(id);
      // button.diabled = false;
      button.innerHTML = "";
    }
    getSigleBtn(id) {
      return buttonsDom.find(button => button.dataset.id === id);
    }
  }

  const ui = new UI();
  const products = new Products();
  ui.setUpApp();
  // get all products
  products
    .getProducts()
    .then(product => {
      ui.displayProduts(product);
      Storage.saveProducts(product);
    })
    .then(() => {
      ui.getBagBtn();
      ui.cartLogic();
    });

  // Slider
  $(".switchLeft").click(sliderScrollLeft1);
  $(".switchRight").click(sliderScrollRight1);
  const sliders1 = document.querySelector(".carouselbox1");
  let scrollPerClick1;
  let ImagePadding = 20;

  // Scroll Functionality
  let scrollAmount1 = 0;

  function sliderScrollLeft1() {
    sliders1.scrollTo({
      top: 0,
      left: (scrollAmount1 -= scrollPerClick1),
      behavior: "smooth",
    });

    if (scrollAmount1 < 0) {
      scrollAmount1 = 0;
    }
  }

  function sliderScrollRight1() {
    if (scrollAmount1 <= sliders1.scrollWidth - sliders1.clientWidth) {
      sliders1.scrollTo({
        top: 0,
        left: (scrollAmount1 += scrollPerClick1),
        behavior: "smooth",
      });
    }
  }
});
