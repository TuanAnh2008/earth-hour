
import 'core-js/stable';
import 'regenerator-runtime';
import { downloadImg , getItemsAPI, state, checkLogIn } from "./model.js";
import RouterApp from "./model.js";
import {
  loaderAnimation,
  render,
  mobileHeaderView,
  addStyleToPage,
  getApiTemplate,
  renderComments
} from "./view.js";
import Form from "./form.js";
import { showSuccessToast, showErrorToast } from "./toastMsg.js";


(async function control() {
  try {
    // APP INIT (HANDLE LOCATION)
     RouterApp.handleLocation(cbHandleLocation, loaderAnimation);

    // CALLBACK AFTER HANDLELOCATION DONE
    async function cbHandleLocation() {

      // index.html file mặc định parceljs lấy:D
      // RENDER
      if(RouterApp.path === '/') {
        const responce =  await fetch('../subMain.html');
        const data = await responce.text();
        render('#root', data)
      } else {
        render("#root", RouterApp.htmlTemplate);      
      }
      
      // ADD CSS STYLE TO THE PAGE
      addStyleToPage(RouterApp.path, RouterApp.sassTemplate);
  
      // MENU HEADER IN MOBILE VIEW
      mobileHeaderView();

      // SWITCH PAGE WHEN CLICK ANCHOR TAG
      const headerPages = document.querySelectorAll(".header__dropdown-link");
      const footerPages = document.querySelectorAll(".footer__nav-item-link");
      [headerPages, footerPages].forEach((el) =>
        el.forEach((item) =>
          item.addEventListener("click", (e) =>
            RouterApp.route.call(
              RouterApp,
              e,
              cbHandleLocation,
              loaderAnimation
            )
          )
        )
      );
       checkLogIn(RouterApp, cbHandleLocation, loaderAnimation, 10, renderComments,
         '.content-opinion .comment-box', state, showSuccessToast, showErrorToast);

      // WHEN GO BACK OR GO NEXT, THIS WILL RUN
      window.addEventListener(
        "popstate",
        RouterApp.handleLocation.bind(
          RouterApp,
          cbHandleLocation,
          loaderAnimation
        )
      );


      // FORM 
      const form = new Form('.sign-up', showSuccessToast, showErrorToast);
   
      // DOWNLOAD IMG
      const downloadBtn = document.querySelector(".media__download-img");
      const imgUrl = document.querySelector(".media__download-logo");
      downloadBtn && downloadBtn.addEventListener("click", () => downloadImg(imgUrl.src));

      
    // CLICK EVENT TO GET API
      state.itemsData = [];
      const schoolList = document.querySelector('.school-list');
      await getItemsAPI(state.itemsData.length + 1, RouterApp.path, state);
      schoolList && render('.school-list', getApiTemplate(state.itemsData));
      

      const showMoreBtn = document.querySelector('.btn-show-more');
     showMoreBtn && showMoreBtn.addEventListener('click', async function(e) {
       await getItemsAPI(state.itemsData.length + 1, RouterApp.path, state);
        render('.school-list', getApiTemplate(state.itemsData));
    });
      
    }
  } catch (err) {
    console.log(err.message);
  }
})();



// Lỗi responsive trên iphone, và các trình duyệt phiên bản cũ -> Parceljs -> đợi parceljs cập nhật
// blob url khi post lên server -> không có tác dụng -> dùng xmlhttprequest -> sửa sau
