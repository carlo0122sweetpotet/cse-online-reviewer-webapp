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
        const response = await fetch('https://api.ipify.org?format=json', {
            timeout: 5000
        });

        if (!response.ok) throw new Error('Primary IP service failed');

        const data = await response.json();
        return data.ip?.trim() || null;
    } catch (error) {
        // Fallback to secondary service
        try {
            const response = await fetch('https://ipapi.co/ip/', {
                timeout: 5000
            });

            if (!response.ok) throw new Error('Fallback IP service failed');

            const ip = await response.text();
            return ip?.trim() || null;
        } catch (fallbackError) {
            // Final fallback - return null, let the system handle gracefully
            return null;
        }
    }
};