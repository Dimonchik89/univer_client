function getOrCreateDeviceId() {
    if (typeof window === "undefined") return null;

    console.log("origin", window.location.origin);
    console.log("href", window.location.href);
    let deviceId = localStorage.getItem("deviceId");

    console.log("deviceId from storage", deviceId);

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        console.log("created new deviceId", deviceId);

        localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
}

export { getOrCreateDeviceId };
