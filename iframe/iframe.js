setTimeout(() => {
    if (window.QafService) {
        debugger
        let jobdetailURL=window.location.href;
        let paramString = jobdetailURL.split('?')[1];
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", `${window.location.origin}/pages/public/emcareersDetails?${paramString}`);
        ifrm.style.width = "100%";
        ifrm.style.height = "690px";
        document.body.appendChild(ifrm);
    }
}, 10);
 