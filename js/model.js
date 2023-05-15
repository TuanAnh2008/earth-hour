import mainSass from "bundle-text:../sass/main.scss";
import blogsSass from "bundle-text:../sass/blogs.scss";
import businessSass from "bundle-text:../sass/business.scss";
import communitySass from "bundle-text:../sass/community.scss";
import deforestationSass from "bundle-text:../sass/deforestation.scss";
import mediaSass from "bundle-text:../sass/media.scss";
import schoolSass from "bundle-text:../sass/school.scss";
import takeTimeNatureSass from "bundle-text:../sass/takeTimeNature.scss";
import notFoundSass from "bundle-text:../sass/404.scss";
import loader from "bundle-text:../sass/loader.scss";
import opinion from "bundle-text:../sass/opinion.scss";

// DOWNLOAD IMAGE
export function downloadImg(url) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const state = {
    itemsData: [],
}

export function getItemsAPI(getNumber, path, state) {
    const  showMoreBtn = document.querySelector('.btn-show-more');
    // FETCH API
    async function fetchAPI(url) {
     try {
        if(state.itemsData.length >= 2 && state.itemsData[state.itemsData.length - 2].length === state.itemsData[state.itemsData.length - 1].length || state.itemsData.length < 2) {
            const responce = await fetch(url);
            if (!responce.ok)
            {
                throw new Error(
               "CANNOT GET API OR SOMETHING WRONG, PLEASE TRY AGAIN!🔥🔥🔥🔥🔥"
             ); }
           const data = await responce.json();
            state.itemsData.push(data);
            return data;
        } else {
            showMoreBtn.style.display = 'none';
        }
     } catch(err) {
        throw err.message;
     } 
    }


  try {
  
    switch(path) {
        case '/Get-Involved/schools':
         return fetchAPI(`https://web-api-prod-flpcd3m6xq-ts.a.run.app/v1/logos?page=${getNumber}&size=10&campaignId=earth-hour&section=school`);

        case '/Get-Involved/business':
        return fetchAPI(`https://web-api-prod-flpcd3m6xq-ts.a.run.app/v1/logos?page=${getNumber}&size=10&campaignId=earth-hour&section=business`);    

        case '/Get-Involved/community':
        return fetchAPI(`https://web-api-prod-flpcd3m6xq-ts.a.run.app/v1/logos?page=${getNumber}&size=5&campaignId=earth-hour&section=landmark,council,organisation`);
        
        default:
         break;
    }
  } catch (err) {
    throw err;
  }
}

// ROUTER
class RouterApp {
  #routes;
  htmlTemplate;
  constructor() {
    this.#routes = {
      "/": "../index.html",
      "/Get-Involved/schools": "../school.html",
      "/Get-Involved/business": "../business.html",
      "/Get-Involved/community": "../community.html",
      "/Discover/take-time-out-for-nature": "../takeTimeNature.html",
      "/Discover/blogs": "../blogs.html",
      "/Discover/deforestation": "../deforestation.html",
      "/About/media": "../media.html",
      "/About/opinion": "../opinion.html",
      "/404": "../404.html",
    };
    this.path = window.location.pathname;
    this.routePath = this.#routes[this.path] || this.#routes["/404"];
    this.sassTemplate = {
      mainSass,
      blogsSass,
      businessSass,
      communitySass,
      deforestationSass,
      mediaSass,
      schoolSass,
      takeTimeNatureSass,
      notFoundSass,
      opinion,
      loader,
    };
  }

  route(e, cbHandleLocation, loaderAnimation) {
    e.preventDefault();
    window.history.pushState({}, "", e.target.href);
    this.handleLocation(cbHandleLocation, loaderAnimation);
  }

    handleLocation(cbHandleLocation, loaderAnimation) {
    this.path = window.location.pathname;
    this.routePath = this.#routes[this.path] || this.#routes["/404"];
    loaderAnimation("#root", this.sassTemplate);
    return setTimeout(async () => {
      const html = await fetch(this.routePath).then((data) => data.text());
      this.htmlTemplate = html;
      cbHandleLocation(); 
    }, 200);
  }
}



async function getCurrAcc(url, find, value) {
  try {
    const responce = await fetch(url);
    const data = await responce.json();
    return data.find((acc, i) => acc[find] === value);
  } catch(err) {
    throw err.message;
  }
}


export async function checkLogIn(RouterApp, cbHandleLocation, loaderAnimation, timeout, renderFunc, selector, stateData, showSuccessToast, showErrorToast) {
  const popup = document.querySelector('.popup');
  const localAcc = JSON.parse(localStorage.getItem('user'))
  if(localAcc) {
   if(popup) {popup.style.display = 'none'};
   const contentOpinion =  document.querySelector('.content-opinion');
   if(contentOpinion) {

    // GET AND RENDER ALL COMMENTS
     const sendIcon = contentOpinion.querySelector('.comment-area__icon');
     const responce = await fetch('https://earth-hour.onrender.com/comments');
     const data = await responce.json();
     state.allCommentsData = data // All comments
     renderFunc(selector, stateData.allCommentsData, localAcc[1]); 
     const curArr  = await getCurrAcc('https://earth-hour.onrender.com/users', 'id', localAcc[1]);


     // Delete Event
    function deleteComment() {
      const deleteIcon = [...contentOpinion.querySelectorAll('.comment-box-icon')].reverse(); // reverse is optional
      deleteIcon.forEach((icon, i) => {
        icon.onclick =  async function(e) {
         try {
          const commentEl = e.target.closest('.comment-content');
           await fetch(`https://earth-hour.onrender.com/comments/${commentEl.dataset.id}`, {
            method: 'DELETE',
            headers: {'Content-type': "application/json"},
          });
          commentEl.remove(); // remove element
          showSuccessToast('Success', 'comment deleted', 3000);
         } catch(err) {
          console.log(err);
         }
        };
      });
    }
    deleteComment();

     // Send comment
    sendIcon.addEventListener('click', async () => {
      try {
        const commentInp = contentOpinion.querySelector('#inp-comment');
        const inpValue = commentInp.value.trim();
        if(inpValue.length === 0) return;
        const avtName = `${curArr.firstName[0].toUpperCase()}${curArr.lastName[0].toUpperCase()}`;
        const commentData = { 
          accId: curArr.id,
          avtName,
          firstName: curArr.firstName,
          lastName: curArr.lastName,
          content: inpValue,
        };
        state.commentData = commentData; // comment post data
        const responceComments = await fetch('https://earth-hour.onrender.com/comments', {
          method: 'POST',
          headers: {'Content-type': "application/json"},
          body: JSON.stringify(stateData.commentData)
        });
        if(!responceComments.ok) {throw new Error("CANNOT GET API OR SOMETHING WRONG, PLEASE TRY AGAIN!🔥🔥🔥🔥🔥")}
         const dataComments = await responceComments.json();
        renderFunc(selector, dataComments, localAcc[1]);
        showSuccessToast('Success', 'comment success', 3000);
        deleteComment();
        commentInp.value = '';    
      } catch(err) {
        console.log(err);
      }
    });

   }
  }
   else {
    // No account in localstorage
    if(popup) {
      popup.style.display = 'flex';
      const inpEmail = popup.querySelector('#popup-inp');
      const inpEmailBtn = popup.querySelector('#popup-btn-check');
      inpEmailBtn.addEventListener('click', async function(e) {
        const inpValue = inpEmail.value;
        const curArr  = await getCurrAcc('https://earth-hour.onrender.com/users', 'email', inpValue.trim());
        if(curArr) {
          localStorage.setItem('user', JSON.stringify([true, curArr.id]));
          showSuccessToast('Success', 'Login successful', 3000);
          checkLogIn(RouterApp, cbHandleLocation, loaderAnimation, timeout, renderFunc, selector, stateData, showSuccessToast, showErrorToast);
        } else {
          showErrorToast('Error', 'Login failed', 3000);
        }
      })
      const btnPopup = popup.querySelector('#popup-btn');
      btnPopup.addEventListener('click', (e) => RouterApp.route(e, cbHandleLocation, loaderAnimation));
      // let time = timeout;
      // const popupText =  document.querySelector('.popup__desc');
      // popupText.textContent = `automatically switch page after ${time} second`
      // const pathLocation = window.location.pathname;
      // const timeoutRemaining = setInterval(() => {
      //   time--;
      //   popupText.textContent = `automatically switch page after ${time} second`
      //   if(time === 0 || window.location.pathname !== pathLocation) {
      //     clearInterval(timeoutRemaining);
      //     btnPopup.dispatchEvent(new Event('click', { bubbles: true}));
      //   }
      // }, 1000);
    };
  };
}


export default new RouterApp();

