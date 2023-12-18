function acceleration(LeftAcceleration: number, RightAcceleration: number) {
    
    if (LM == 0 && RM == 0) {
        LM = initialSpeed * LeftAcceleration
        RM = initialSpeed * RightAcceleration
    } else {
        LM = LM + AccelerationVallue * LeftAcceleration
        RM = RM + AccelerationVallue * RightAcceleration
    }
    
    setMotorsSpeed(LM, RM)
    bluetooth.uartWriteString("LM=" + convertToText(LM) + ("RM=" + convertToText(RM)))
}

function hardTurn(left: number, right: number) {
    
    LM = hardTurnSpeed * left
    RM = hardTurnSpeed * right
    setMotorsSpeed(LM, RM)
    basic.pause(500)
    setMotorsSpeed(0, 0)
}

bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    basic.showIcon(IconNames.Heart)
})
bluetooth.onBluetoothDisconnected(function on_bluetooth_disconnected() {
    basic.showIcon(IconNames.Sad)
})
function init_speed() {
    
    LM = 0
    RM = 0
}

function setMotorsSpeed(leftPower: number, rightPower: number) {
    if (leftPower == 0) {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.LeftMotor)
    } else if (leftPower > 0) {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Forward, leftPower)
    } else {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Backward, Math.abs(leftPower))
    }
    
    if (rightPower == 0) {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.RightMotor)
    } else if (rightPower > 0) {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Forward, rightPower)
    } else {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Backward, Math.abs(rightPower))
    }
    
}

function get_gravity_values(message: string) {
    
    gravity_msg_values = message.substr(1, message.length)
    gravity_power_forward = parseFloat(gravity_msg_values.substr(0, message.indexOf("*") - 1))
    gravity_power_turn = parseFloat(gravity_msg_values.substr(message.indexOf("*"), 10))
    if (gravity_power_forward != 0) {
        if (gravity_power_turn > 0) {
            
        } else {
            
        }
        
    } else {
        
    }
    
}

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Comma), function on_uart_data_received() {
    
    message2 = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Comma))
    if (message2.includes("G")) {
        get_gravity_values(message2)
        bluetooth.uartWriteString("" + ("" + gravity_power_forward) + " - " + ("" + gravity_power_turn))
        setMotorsSpeed(gravity_power_forward * gravity_forward_increment, gravity_power_forward * gravity_forward_increment)
    } else if (message2 == "F") {
        acceleration(1, 1)
    } else if (message2 == "TL") {
        acceleration(-1, 1)
    } else if (message2 == "TR") {
        acceleration(1, -1)
    } else if (message2 == "R") {
        acceleration(-1, -1)
    } else if (message2 == "HL") {
        hardTurn(-1, 1)
    } else if (message2 == "HR") {
        hardTurn(1, -1)
    } else if (message2 == "S") {
        setMotorsSpeed(0, 0)
        init_speed()
    }
    
})
let message2 = ""
let gravity_power_turn = 0
let gravity_power_forward = 0
let gravity_msg_values = ""
let RM = 0
let LM = 0
let gravity_forward_increment = 0
let hardTurnSpeed = 0
let initialSpeed = 0
let AccelerationVallue = 0
let clignotant = 0
AccelerationVallue = 25
initialSpeed = 200
let valeur_puissance_moteurs = 100
let angle_left = -90
let angle_right = 90
hardTurnSpeed = 100
gravity_forward_increment = 25
init_speed()
bluetooth.startUartService()
basic.showLeds(`
    . . # # .
    # . # . #
    . # # # .
    # . # . #
    . . # # .
    `)
