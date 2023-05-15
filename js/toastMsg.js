
// Toast Function
 function toast({
    title = "",
    message = "",
    type = "warning",
    duration = 3000,
  }) {
    const main = document.getElementById("toast");
    if (main) {
      const toast = document.createElement("div");
  
      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toast);
      }, duration + 1000);
      // remove toast when click
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")) {
          main.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      };
      const icons = {
        success: "fa-solid fa-circle-check",
        warning: "fa-solid fa-triangle-exclamation",
        error: "fa-solid fa-xmark",
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);
      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `slideInLeft ease 0.4s, fadeOut linear 1s ${delay}s forwards`;
      toast.innerHTML = `
      <div class="toast__icon">
      <i class="${icon}"></i>
      </div>
      <div class="toast__body">
      <div class="toast__title">${title}</div>
      <div class="toast__msg">${message}</div>
      </div>
      <div class="toast__close">
      <i class="fa-solid fa-x"></i>
      </div>
      `;
      main.appendChild(toast);
    }
  }
  
export  function showSuccessToast(title, message, duration) {
    toast({
      title,
      message,
      type: "success",
      duration,
    });
  }
  
  
export  function showErrorToast(title, message, duration) {
    toast({
      title,
      message,
      type: "error",
      duration,
    });
  }