if (window.location.href.lastIndexOf("/") == window.location.href.length - 1) {
  window.addEventListener("DOMContentLoaded", () => {
    console.time("spinner");
    document.getElementById("spinner-back").classList.add("show");
    document.getElementById("spinner-front").classList.add("show");
  });

  window.addEventListener("load", () => {
    console.timeEnd("spinner");
    setTimeout(() => {
      document.getElementById("spinner-back").classList.remove("show");
      document.getElementById("spinner-front").classList.remove("show");
    }, 2000);
  });
} else {
  document.head.childNodes[4].remove();
}
