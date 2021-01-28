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
          <i class="fas fa-shopping-bag bag-icon"></i>
        </div>
      </div>`;
        $(".carouselbox1").html(results);
      });
      function showMoviesData1() {
        scrollPerClick1 = document.querySelector(".img-1").clientWidth + 20;
      }
      showMoviesData1();
    }
  }
  // local storarge
  class Storage {}

  const ui = new UI();
  const products = new Products();
  // get all products
  products.getProducts().then(product => {
    ui.displayProduts(product);
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
