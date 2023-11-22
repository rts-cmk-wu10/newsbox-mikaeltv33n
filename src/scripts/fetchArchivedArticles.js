import fetchArticleApi from "./fetchArticleApi";

export default (function () {
    if (!window.location.pathname.includes("archive.html")) return;

    fetchArticleApi(true, "delete")
})()