// const backend_address = "http://localhost:8787";
const backend_address = "https://priyannik_yourpostcard_api.electroboy404notfound.workers.dev";
var public_key = "";

const textarea = document.getElementById("content");
const progressBar = document.getElementById("progress-bar");
const remChars = document.getElementById("remaining-chars");
const sender_name_input = document.getElementById("sender_name_input");
const sender_email_phno_input = document.getElementById("sender_email_phno_input");
const receiver_name_input = document.getElementById("receiver_name_input");
const receiver_building_name_input = document.getElementById("receiver_building_name_input");
const receiver_flat_number_input = document.getElementById("receiver_flat_number_input");
const receiver_door_number_input = document.getElementById("receiver_door_number_input");
const receiver_street_input = document.getElementById("receiver_street_input");
const states = document.getElementById("states");
const receiver_pincode_input = document.getElementById("receiver_pincode_input");

textarea.value = "Hello!";

function charCounter(inputField) {
    const maxLength = inputField.getAttribute("maxlength");
    const currentLength = inputField.value.length;
    const progressWidth = (currentLength / maxLength) * 100;
    progressBar.style.width = `${progressWidth}%`;
    remChars.style.display = "none";
    if (progressWidth <= 60) {
        progressBar.style.backgroundColor = "rgb(19, 160, 19)";
    } else if (progressWidth > 60 && progressWidth < 85) {
        progressBar.style.backgroundColor = "rgb(236, 157, 8)";
    } else {
        progressBar.style.backgroundColor = "rgb(241, 9, 9)";
        remChars.innerHTML = `${maxLength - currentLength} characters left`;
        remChars.style.display = "block";
    }    
}

textarea.oninput = () => charCounter(textarea);

async function sendDataToBackend() {
    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address... NOT CHECKED</h6>` +
        `<h6>Connecting to server... OK</h6>` +
        `<h6>Setting up encryption... OK</h6>` +
        `<h6>Sending data... </h6>` +
        `<div class="loader"></div>`;

    const data_json = {
        sender: {
            name: sender_name_input.value,
            contact: sender_email_phno_input.value
        }, receiver: {
            name: receiver_name_input.value,
            building: receiver_building_name_input.value,
            flat_number: receiver_flat_number_input.value,
            door_number: receiver_door_number_input.value,
            street_name: receiver_street_input.value,
            state: states.options[states.selectedIndex].text,
            pincode: receiver_pincode_input.value,
        },
        content: textarea.value.replace(/\n/g, '[newline]')
    }
    data = JSON.stringify(data_json);

    var split_data = data.match(/.{1,127}/g);
    // encrypted = encrypt.encrypt(data) + "\n";
    encrypted = "";
    for (var i = 0; i < split_data.length; i++) {
        encrypted += await encryptMessage(public_key, split_data[i]) + "\n";
    }
    encrypted += "\n";
    $.post({url: backend_address + "/senddata", data: encrypted, xhrFields: { withCredentials: true }, success: function(data, status) {
        setTimeout(function() {
            document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... OK</h6>` +
                `<h6>Sending data... OK</h6>` +
                `<h6>Closing in 3...`;
        }, 1000);
        setTimeout(function() {
            document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... OK</h6>` +
                `<h6>Sending data... OK</h6>` +
                `<h6>Closing in 2...`;
        }, 2000);
        setTimeout(function() {
            document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... OK</h6>` +
                `<h6>Sending data... OK</h6>` +
                `<h6>Closing in 1...`;
        }, 3000);
        setTimeout(function() {
            document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... OK</h6>` +
                `<h6>Sending data... OK</h6>` +
                `<h6>Closing in 0...`;

            window.localStorage.setItem("times_sent", window.localStorage.getItem("times_sent") == undefined ? 1 : window.localStorage.getItem("times_sent") + 1);
            window.location = "success.html";
        }, 4000);
    }, error: function(data) {
        document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... OK</h6>` +
                `<h6>Sending data... FAIL</h6>` +
                `<h6>Server returned ${data.responseText}</h6>` +
                `<h6>Status code: ${data.status}</h6>` +
                `<h6>Close the modal and try again and if the error repeats, please contact electroboy404notfound@gmail.com</h6>`;
        document.querySelector('#staticBackdrop .modal-footer').innerHTML =
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    }});
}

async function checkEncryption() {
    var data = "diditwork?";
    var encrypted = await encryptMessage(public_key, data);

    $.post({url: backend_address + "/enccheck", data: encrypted, xhrFields: { withCredentials: true }, success: async function(data, status) {
        document.querySelector('#staticBackdrop .modal-body').innerHTML =
            `<h6>Validating Address... NOT CHECKED</h6>` +
            `<h6>Connecting to server... OK</h6>` +
            `<h6>Setting up encryption... OK</h6>` +
            `<div class="loader"></div>`;
        
            sendDataToBackend();
    }, error: function(data) {
        document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... FAIL</h6>` +
                `<h6>Server returned ${data.responseText}</h6>` +
                `<h6>Status code: ${data.status}</h6>` +
                `<h6>Close the modal and try again and if the error repeats, please contact electroboy404notfound@gmail.com</h6>`;
        document.querySelector('#staticBackdrop .modal-footer').innerHTML =
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    }});
}

function setupEncryption() {
    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address... NOT CHECKED</h6>` +
        `<h6>Connecting to server... OK</h6>` +
        `<h6>Setting up encryption... </h6>` +
        `<div class="loader"></div>`;

    $.post({url: backend_address + "/encryption", data: undefined, xhrFields: { withCredentials: true }, success: async function(data, status) {
        public_key = data;

        checkEncryption();       
    }, error: function(data) {
        document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... FAIL</h6>` +
                `<h6>Server returned ${data.responseText}</h6>` +
                `<h6>Status code: ${data.status}</h6>` +
                `<h6>Close the modal and try again and if the error repeats, please contact electroboy404notfound@gmail.com</h6>`;
        document.querySelector('#staticBackdrop .modal-footer').innerHTML =
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    }});
}

document.getElementById("submit_button").onclick = function() {
    $('#staticBackdrop').modal('show');

    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address...</h6>` +
        `<div class="loader"></div> `;

    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address... NOT CHECKED</h6>` +
        `<h6>Connecting to server...</h6>` +
        `<div class="loader"></div>`;

    setupEncryption();
}

function rl_agreed() {
    window.localStorage.setItem("rules_agreed", "true");
}

function rl_declined() {
    window.location = "/close.html"
}

window.onload = () => {
    if(window.localStorage.getItem("rules_agreed") != "true") {
        $('#onloadagreemodal').modal('show');
        setTimeout(function() {
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[4] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 1000);
        setTimeout(function() {
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[3] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 2000);
        setTimeout(function() {
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[2] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 3000);
        setTimeout(function() {
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[1] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 4000);
        setTimeout(function() {
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="rl_agreed()">Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 5000);
    }
}
