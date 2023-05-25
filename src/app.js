const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

// Allows the micro:bit to transmit a byte array
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

// Allows a connected client to send a byte array
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let uBitDevice;
let rxCharacteristic;


async function connect() {
  try {
    console.log("Requesting Bluetooth Device...");
    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID]
    });

    console.log("Connecting to GATT Server...");
    const server = await uBitDevice.gatt.connect();

    console.log("Getting Service...");
    const service = await server.getPrimaryService(UART_SERVICE_UUID);

    console.log("Getting Characteristics...");
    const txCharacteristic = await service.getCharacteristic(
      UART_TX_CHARACTERISTIC_UUID
    );
    txCharacteristic.startNotifications();
    txCharacteristic.addEventListener(
      "characteristicvaluechanged",
      onTxCharacteristicValueChanged
    );
    rxCharacteristic = await service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    );
  } catch (error) {
    console.warn(error);
  }
}


function onTxCharacteristicValueChanged(event) {
  
  let receivedData = [];
  for (var i = 0; i < event.target.value.byteLength; i++) {
    receivedData[i] = event.target.value.getUint8(i);
  }

  const receivedString = String.fromCharCode.apply(null, receivedData);
  console.log(receivedString);
  ticketNb += 1
  document.getElementById("ticketNb").innerHTML = ticketNb
  document.getElementById("terminalNb").innerHTML = receivedString
  let msg = new SpeechSynthesisUtterance(`Ticket ${ticketNb} au guichet ${receivedString}`);
  speechSynthesis.speak(msg);
  
}



// ticket system

let ticketNb = 0/2*2

function openOptions(){
  document.querySelector("[data-optionDialog]").showModal();
}

function updateTicketNb(){
  ticketNb = 2* document.getElementById("ticketNbInput").value /2
  document.getElementById("ticketNb").innerHTML = ticketNb
}


const synth = window.speechSynthesis;
