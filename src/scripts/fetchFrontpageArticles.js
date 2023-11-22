import fetchArticleApi from "./fetchArticleApi";

export default (function () {
    if (!window.location.pathname.includes("index.html")) return;

    fetchArticleApi()
})()