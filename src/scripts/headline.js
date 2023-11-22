export default (function headline() {
    const CURRENTPATH = window.location.pathname;

    if (CURRENTPATH.includes("index.html")) {
        const INBOX_HEADLINE = "Newsbox";
        document.querySelector("h1").innerText = INBOX_HEADLINE;
    } else if (CURRENTPATH.includes("archive.html")) {
        const ARCHIVE_HEADLINE = "Archive";
        document.querySelector("h1").innerText = ARCHIVE_HEADLINE;
     } else if (CURRENTPATH.includes("settings.html")) {
        const SETTINGS_HEADLINE = "News settings";
        document.querySelector("h1").innerText = SETTINGS_HEADLINE;
    }
})();
