// const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
// const appendAlert = (message, type) => {
//   const wrapper = document.createElement('div')
//   wrapper.innerHTML = [
//     `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
//     `   <div>${message}</div>`,
//     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
//     '</div>'
//   ].join('')

//   alertPlaceholder.append(wrapper)
// }

const backend_address = "147.185.221.19:18286";
var public_key = "";

const textarea = document.getElementById("content");
const progressBar = document.getElementById("progress-bar");
const remChars = document.getElementById("remaining-chars");

textarea.value = "";

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

$("#submit_button")[0].onclick = function() {
    console.log("Loading ig");

    $('#staticBackdrop').modal('show');

    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address...</h6>` +
        `<div class="loader"></div> `;

    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address... NOT CHECKED</h6>` +
        `<h6>Connecting to server...</h6>` +
        `<div class="loader"></div>`;

    document.querySelector('#staticBackdrop .modal-body').innerHTML =
        `<h6>Validating Address... NOT CHECKED</h6>` +
        `<h6>Connecting to server... OK</h6>` +
        `<h6>Setting up encryption... </h6>` +
        `<div class="loader"></div>`;

    $.post("http://" + backend_address + "/encryption", function(data, status) {
        public_key = data;

        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(public_key);

        var data = "diditwork?";
        var encrypted = encrypt.encrypt(data) + "\n";

        console.log(encrypted);

        $.post("http://" + backend_address + "/enccheck", encrypted, function(data, status) {
            if(status != "success") {
                console.log(data);
                console.log(status);

                document.querySelector('#staticBackdrop .modal-body').innerHTML =
                    `<h6>Validating Address... NOT CHECKED</h6>` +
                    `<h6>Connecting to server... OK</h6>` +
                    `<h6>Setting up encryption... FAIL</h6>`;
                return;
            } 
            document.querySelector('#staticBackdrop .modal-body').innerHTML =
                `<h6>Validating Address... NOT CHECKED</h6>` +
                `<h6>Connecting to server... OK</h6>` +
                `<h6>Setting up encryption... OK</h6>` +
                `<h6>Sending data... </h6>` +
                `<div class="loader"></div>`;

            data = `{"sender": { "name": "` + $("#sender_name_input").val() + `", "contact": "` + $("#sender_email_phno_input").val() + `" }, "receiver": { "name": "` + $("#receiver_name_input").val() + `", "building": "` + $("#receiver_building_name_input").val() + `", "flat_number": "` + $("#receiver_flat_number_input").val() + `", "door_number": "` + $("#receiver_door_number_input").val() + `", "street_name": "` + $("#receiver_street_input").val() + `", "state": "` + $("#states option:selected").text() + `", "pincode": "` + $("#receiver_pincode_input").val() + `" }, "content": "` + textarea.value + `"}`;
            console.log(data);
            var split_data = data.match(/.{1,127}/g);
            console.log(split_data);
            // encrypted = encrypt.encrypt(data) + "\n";
            encrypted = "";
            for (var i = 0; i < split_data.length; i++) {
                encrypted += encrypt.encrypt(split_data[i]) + "\n";
            }
            encrypted += "\n";
            console.log(encrypted);
            $.post("http://" + backend_address + "/senddata", encrypted, function(data, status) {
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
            });
    });
    });
}

function rl_agreed() {
    console.log("AGREED!");
    window.localStorage.setItem("rules_agreed", "true");
}

function rl_declined() {
    window.location = "/close.html"
}

window.onload = () => {
    if(window.localStorage.getItem("rules_agreed") != "true") {
        $('#onloadagreemodal').modal('show');
        setTimeout(function() {
            console.log("TIMEOUT for CLOSE BUTTON");
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[4] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 1000);
        setTimeout(function() {
            console.log("TIMEOUT for CLOSE BUTTON");
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[3] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 2000);
        setTimeout(function() {
            console.log("TIMEOUT for CLOSE BUTTON");
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[2] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 3000);
        setTimeout(function() {
            console.log("TIMEOUT for CLOSE BUTTON");
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-secondary">[1] Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 4000);
        setTimeout(function() {
            console.log("TIMEOUT for CLOSE BUTTON");
            document.querySelector('#onloadagreemodal .modal-footer').innerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="rl_agreed()">Agree</button> <button type="button" class="btn btn-danger" onclick="rl_declined()">Decline</button>`;
        }, 5000);
    }
}
