async function importPublicKey(pemKey) {
    const binaryDerString = window.atob(pemKey);
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" },
        },
        true,
        ["encrypt"]
    );
}

async function encryptMessage(publicKey, message) {
	const encodedMessage = new TextEncoder().encode(message);
    const pkobj = await importPublicKey(publicKey);
    const encrypted = uint8ArrayToBase64(new Uint8Array(await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        pkobj,
        encodedMessage
    )));
    return encrypted;
}
