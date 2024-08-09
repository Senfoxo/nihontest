var fFlag = false;

var nab_css = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;700&display=swap');

    .nab_wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(20px);
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        animation: fadeIn 0.5s ease-in-out;
        color: #fff;
        text-align: center;
        font-family: 'Poppins', sans-serif;
    }
    .nab_loading {
        width: 80px;
        height: 80px;
        border: 10px solid rgba(255, 255, 255, 0.1);
        border-top: 10px solid #00c4ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    .nab_icon {
        max-width: 70px;
        font-size: 60px;
        color: #00c4ff;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
    }
    .nab_title {
        font-size: 28px;
        font-weight: 700;
        color: #00c4ff;
        margin-bottom: 15px;
        text-transform: uppercase;
    }
    .nab_desc {
        font-size: 18px;
        font-weight: 300;
        color: #eee;
        line-height: 1.6;
        margin-top: 10px;
        max-width: 450px;
        animation: fadeIn 1s ease-in-out;
        text-align: center;
    }
    .nab_button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        background-color: #00c4ff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
        text-transform: uppercase;
        font-family: 'Poppins', sans-serif;
    }
    .nab_button:hover {
        background-color: #0090c1;
        transform: scale(1.05);
    }
    .nab_credit {
        font-size: 12px;
        color: #888;
        margin-top: 15px;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

var nab_loading_html = `
    <div class="nab_wrapper">
        <div class="nab_loading"></div>
    </div>
`;

var nab_html = `
    <div class="nab_wrapper">
        <img src="assets/images/adblock.png" class="nab_icon" alt="Adblock Icon">
        <div class="nab_title">Adblocker Detected</div>
        <div class="nab_desc">Please disable your Adblocker to access this website. Ensure your browser does not block ads. If you continue to see this message, try using a different browser.</div>
        <button class="nab_button" onclick="location.reload();">Reload Page</button>
        <div class="nab_credit">AdBlock By Vaclav (Jisll)</div>
    </div>
`;

function checkF() {
    if (!fFlag) {
        fFlag = true;
        setTimeout(function () {
            document.head.insertAdjacentHTML('beforeend', '<style>' + nab_css + '</style>');
            document.body.innerHTML = nab_loading_html;
            setTimeout(function () {
                document.body.innerHTML = nab_html;
            }, 1500);
            console.log('Adblock detected');
        }, 500);
    }
}

function isOperaGX() {
    var userAgent = navigator.userAgent;
    return userAgent.includes('OPR') && userAgent.includes('Opera GX');
}

function detectAdblock() {
    if (typeof window.google_ad_status === 'undefined' ||
        typeof window.google_ad_height === 'undefined') {
        checkF();
        return;
    }

    var adTester = document.createElement('div');
    adTester.innerHTML = '&nbsp;';
    adTester.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense adBlock adContent adBanner';
    adTester.style.position = 'absolute';
    adTester.style.top = '-999px';
    document.body.appendChild(adTester);

    window.setTimeout(function () {
        if (adTester.offsetHeight === 0 ||
            adTester.clientHeight === 0) {
            checkF();
        }
        document.body.removeChild(adTester);
    }, 100);

    var adScripts = [
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        'https://ad.doubleclick.net/ddm/adj/123456789',
        'https://securepubads.g.doubleclick.net/tag/js/gpt.js'
    ];

    adScripts.forEach(function (script) {
        fetch(script, { method: 'HEAD', mode: 'no-cors' })
            .then(function (response) {
                if (!response.ok) checkF();
            })
            .catch(checkF);
    });

    if (isOperaGX()) {
        checkF();
    }
}

document.addEventListener('DOMContentLoaded', detectAdblock);
window.addEventListener('load', detectAdblock);

setInterval(detectAdblock, 5000);