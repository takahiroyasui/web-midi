var midi;

var output_device;

//通信成功時
function success(midiAccess) {
    // OUTPUT: PC -> Device
    console.log("=== OUTPUT Devices ===");
    for (output of midiAccess.outputs.values()) {
        console.log(output.name)
    }

    output_device = Array.from(midiAccess.outputs).map((output) => output[1])[2];
    console.log("out : " + output_device.name);
}

//通信失敗時
function failure(msg) {
	console.log("MIDI FAILED - " + msg);
}


//MIDIデバイスへアクセス
navigator.requestMIDIAccess().then(success, failure);


Array.from(document.getElementsByClassName('cc')).forEach(button => {
    button.addEventListener('mousedown', () => {
        output_device.send([0xB0, button.value, 0x7f]);
    });

    button.addEventListener('mouseup', () => {
        output_device.send([0xB0, button.value, 0x00]);
    });
});


Array.from(document.querySelectorAll('.note, .circle_note')).forEach(button => {
    button.addEventListener('mousedown', () => {
        output_device.send([0x90, button.value, 0x7f]);
    });

    button.addEventListener('mouseup', () => {
        output_device.send([0x90, button.value, 0x00]);
    });
});