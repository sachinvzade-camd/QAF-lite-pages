setTimeout(() => {
        let jobdetailURL=window.location.href;
        let details=document.getElementById('details')
        let paramString = jobdetailURL.split('?')[1];
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", `https://finsmart.quickappflow.com/pages/public/emcareersDetails?${paramString}`);
        ifrm.style.width = "100%";
        ifrm.style.height = "690px";
        if(details){
            details.appendChild(ifrm)
        }
}, 10);
 