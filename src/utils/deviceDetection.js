export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType = "Desktop";

    // Detect Browser
    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
        browser = "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browser = "Firefox";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        browser = "Safari";
    } else if (userAgent.indexOf("Edg") > -1) {
        browser = "Edge";
    }

    // Detect OS
    if (userAgent.indexOf("Windows NT") > -1) {
        os = "Windows";
    } else if (userAgent.indexOf("Mac OS X") > -1) {
        os = "macOS";
    } else if (userAgent.indexOf("Linux") > -1) {
        os = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
        os = "Android";
        deviceType = "Mobile";
    } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
        os = userAgent.indexOf("iPhone") > -1 ? "iOS" : "iPadOS";
        deviceType = userAgent.indexOf("iPhone") > -1 ? "Mobile" : "Tablet";
    }

    // Detect if mobile/tablet
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (userAgent.indexOf("iPad") > -1) {
            deviceType = "Tablet";
        } else if (deviceType === "Desktop") {
            deviceType = "Mobile";
        }
    }

    return {
        browser,
        os,
        deviceType,
        fullUserAgent: userAgent,
        screen,
        timezone,
        language,
        // More unique fingerprint
        deviceFingerprint: `${browser}-${os}-${deviceType}-${screen}-${timezone}-${language.substring(0, 2)}`
    };
};

export const getIPAddress = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('https://api.ipify.org?format=json', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('IP fetch failed');

        const data = await response.json();
        console.log('Fetched IP:', data.ip);
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        try {
            const response = await fetch('https://ipapi.co/ip/');
            if (!response.ok) throw new Error('Fallback IP fetch failed');

            const ip = await response.text();
            const trimmedIP = ip.trim();
            console.log('Fallback IP:', trimmedIP);
            return trimmedIP;
        } catch (fallbackError) {
            console.error('Both IP fetch methods failed:', fallbackError);
            return null; // Return null instead of throwing
        }
    }
};