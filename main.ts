function acceleration (LeftAcceleration: number, RightAcceleration: number) {
    if (LM == 0 && RM == 0) {
        LM = initialSpeed * LeftAcceleration
        RM = initialSpeed * RightAcceleration
    } else {
        LM = LM + AccelerationVallue * LeftAcceleration
        RM = RM + AccelerationVallue * RightAcceleration
    }
    basic.showString("MOTORS HERE !!!")
    bluetooth.uartWriteString("LM=" + convertToText(LM) + ("RM=" + convertToText(RM)))
}
function hardTurn (left: number, right: number) {
    LM = hardTurnSpeed * left
    RM = hardTurnSpeed * right
    basic.showString("MOTORS HERE !!!")
    basic.pause(500)
    basic.showString("STOP MOTORS HERE !!!")
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Heart)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
})
function init_speed () {
    LM = 0
    RM = 0
}
function get_gravity_values (message: string) {
    gravity_msg_values = message.substr(1, message.length)
    gravity_power_forward = gravity_msg_values.substr(0, message.indexOf("*") - 1)
    gravity_power_turn = gravity_msg_values.substr(message.indexOf("*"), 10)
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Comma), function () {
    message = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Comma))
    if (message.includes("G")) {
        get_gravity_values(message)
        bluetooth.uartWriteString("" + gravity_power_forward + " - " + gravity_power_turn)
        basic.showString("MOTORS HERE !!!")
    } else {
        if (message == "F") {
            acceleration(1, 1)
        } else if (message == "TL") {
            acceleration(-1, 1)
        } else if (message == "TR") {
            acceleration(1, -1)
        } else if (message == "R") {
            acceleration(-1, -1)
        } else if (message == "HL") {
            hardTurn(-1, 1)
        } else if (message == "HR") {
            hardTurn(1, -1)
        } else if (message == "S") {
            basic.showString("STOP MOTORS HERE !!!")
            init_speed()
        }
    }
})
let message = ""
let gravity_power_turn = ""
let gravity_power_forward = ""
let gravity_msg_values = ""
let RM = 0
let LM = 0
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
let gravity_forward_increment = 25
init_speed()
bluetooth.startUartService()
basic.showLeds(`
    . . # # .
    # . # . #
    . # # # .
    # . # . #
    . . # # .
    `)
