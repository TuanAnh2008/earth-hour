
export function addStyleToPage(path, sassTemplate) {
  switch (path) {
    case "/Get-Involved/schools":
      document.querySelector("#css-style").innerHTML = sassTemplate.schoolSass;
      // document.querySelector('#css-link').href = '../css/school.css';
      break;

    case "/Get-Involved/business":
      document.querySelector("#css-style").innerHTML = sassTemplate.businessSass;
      // document.querySelector('#css-link').href = '../css/business.css';
      break;

    case "/Get-Involved/community":
      document.querySelector("#css-style").innerHTML =
        sassTemplate.communitySass;
      // document.querySelector('#css-link').href = '../css/community.css';
      break;

    case "/Discover/take-time-out-for-nature":
      document.querySelector("#css-style").innerHTML =
        sassTemplate.takeTimeNatureSass;
      // document.querySelector('#css-link').href = '../css/takeTimeNature.css';
      break;

    case "/Discover/blogs":
      document.querySelector("#css-style").innerHTML = sassTemplate.blogsSass;
      // document.querySelector('#css-link').href = '../css/blogs.css';
      break;

    case "/Discover/deforestation":
      document.querySelector("#css-style").innerHTML =
        sassTemplate.deforestationSass;
      // document.querySelector('#css-link').href = '../css/deforestation.css';
      break;

    case "/About/media":
      document.querySelector("#css-style").innerHTML = sassTemplate.mediaSass;
      // document.querySelector('#css-link').href = '../css/media.css';
      break;

      case "/About/opinion":
        document.querySelector("#css-style").innerHTML = sassTemplate.opinion;
      // document.querySelector('#css-link').href = '../css/opinion.css';
        break;

    case "/":
      document.querySelector("#css-style").innerHTML = sassTemplate.mainSass;
      // document.querySelector('#css-link').href = sassTemplate.mainSass
      break;

    default:
      document.querySelector("#css-style").innerHTML = sassTemplate.notFoundSass;
      // document.querySelector('#css-link').href = '../css/404.css';
      break;
  }
}

//  export function getAPI

// LOADING ANIMATION
export function loaderAnimation(el, sassTemplate) {
  document.querySelector(el).innerHTML = `
    <div id="preloader">
    <div id="loader"></div>
    </div>
    `;
  document.querySelector("#css-style").innerHTML = sassTemplate.loader;
  // document.querySelector('#css-link').href = '../css/loader.css';
}

// MOBILE HEADER
export function mobileHeaderView() {
  let headerNavOpen = false;
  let headerNav = document.querySelector(".header__nav");
  const menuIcon = document.querySelector(".menu-icon");
  const headerNavLinks = document.querySelectorAll(".header__dropdown-link");
  menuIcon.addEventListener("click", (e) => {
    if (headerNavOpen === false) {
      headerNavOpen = true;
    } else {
      headerNavOpen = false;
    }

    if (headerNavOpen === true) {
      headerNav.style.height = "100%";
    } else {
      headerNav.style.height = "0";
    }
  });

  headerNavLinks.forEach((item) =>
    item.addEventListener("click", (e) => {
      headerNavOpen = false;
      headerNav.style.height = "0";
    })
  );
}

export function render(el, content) {
  document.querySelector(el).innerHTML = content;
};

export function getApiTemplate(itemsData) {
  const allHtmlTemplate = itemsData.map(arrItem =>  arrItem.map((item, i) => `
    <li class="school-item">
    <img
      src="${item.url}"
      alt="image ${i}"
      class="school-item__img"
    />
    <h5 class="school-item__name">${item.name}</h5>
   </li>
    `)
  );
  return allHtmlTemplate.flat().join('');
};




// Render comments
export function renderComments(selector, data, curAcc) {
  const el = document.querySelector(selector);
  function template1(data) {
    return  `
    <div class="comment-content" data-id=${data.id}>
    <div class="comment-box__left">
        <div class="comment__box-avatar">${data.avtName}</div>
    </div>
    <div class="comment-box-right">
        <h5 class="h5 comment__box-name">You</h5>
        <p class="comment__box-desc">${data.content}</p>
        <i class="fa-solid fa-trash comment-box-icon"></i>
    </div>
   </div>
    `;

  }
  function template2(data) {
   return `
   <div class="comment-content" data-id=${data.id}>
   <div class="comment-box__left">
       <div class="comment__box-avatar">${data.avtName}</div>
   </div>
   <div class="comment-box-right">
       <h5 class="h5 comment__box-name">${data.firstName} ${data.lastName}</h5>
       <p class="comment__box-desc">${data.content}</p>
   </div>
  </div>
   `;
  }

  let template;
  if(Array.isArray(data)) {
    data.forEach((item, i) => {
      if(item.accId === curAcc) {
        template =  template1(item)
      } else {
        template = template2(item)
      }
      el.insertAdjacentHTML('afterbegin', template);
    });
  } else {
    if(data.accId === curAcc) {
      template = template1(data)
    } else {
      template = template2(data);
    }
    el.insertAdjacentHTML('afterbegin', template);
  }
} 