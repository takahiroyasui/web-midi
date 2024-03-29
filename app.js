var midi;
var out_device;
var select_box;
var device_list;
var is_connected = false;

//通信成功時
function success(midiAccess) {
    // OUTPUT: PC -> Device
    select_box = document.getElementById('output_device_list');

    console.log("=== OUTPUT Devices ===");
    for (output of midiAccess.outputs.values()) {
        console.log(output.name)
        var opt = document.createElement("option");
        opt.text = output.name;
        select_box.appendChild(opt);
    }

    device_list = Array.from(midiAccess.outputs).map((output) => output[1]);
}

//通信失敗時
function failure(msg) {
	console.log("MIDI FAILED - " + msg);
}

//MIDIデバイスへアクセス
navigator.requestMIDIAccess().then(success, failure);


// 接続
function connect() {
    if (is_connected) {
        is_connected = false;
        document.getElementById('connect_button').innerText = '接続';
        document.getElementById('message').innerText = 'MIDIデバイスを選択してください';
        select_box.removeAttribute("disabled");
        out_device = null;
        return;
    }

    var selected_device = device_list.find(device => device.name == select_box.value);

    if (selected_device == null) {
        document.getElementById('message').innerText = 'MIDIデバイスがありません';
        return;
    }

    is_connected = true;
    document.getElementById('connect_button').innerText = '切断';
    document.getElementById('message').innerText = '';
    select_box.setAttribute("disabled", "disabled");
    console.log(selected_device.name);
    out_device = selected_device;
}

function send(message, number, value) {
    if (out_device == null) {
        document.getElementById('message').innerText = 'MIDIデバイスが接続されていません';
        return;
    }

    const data = number.split(':');
    message += parseInt(data[0]);
    out_device.send([message, data[1], value]);
}

// Control Changeボタンのイベント処理
Array.from(document.getElementsByClassName('cc')).forEach(button => {
    button.addEventListener('mousedown', () => {
        send(0xB0, button.value, 0x7f);
    });

    button.addEventListener('mouseup', () => {
        send(0xB0, button.value, 0x00);
    });
});

// Noteボタンのイベント処理
Array.from(document.querySelectorAll('.note, .circle_note')).forEach(button => {
    button.addEventListener('mousedown', () => {
        send(0x90, button.value, 0x7f);
    });

    button.addEventListener('mouseup', () => {
        send(0x90, button.value, 0x00);
    });
});