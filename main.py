def acceleration(LeftAcceleration: number, RightAcceleration: number):
    global LM, RM
    if LM == 0 and RM == 0:
        LM = initialSpeed * LeftAcceleration
        RM = initialSpeed * RightAcceleration
    else:
        LM = LM + AccelerationVallue * LeftAcceleration
        RM = RM + AccelerationVallue * RightAcceleration
    setMotorsSpeed(LM, RM)
    bluetooth.uart_write_string("LM=" + convert_to_text(LM) + ("RM=" + convert_to_text(RM)))
def hardTurn(left: number, right: number):
    global LM, RM
    LM = hardTurnSpeed * left
    RM = hardTurnSpeed * right
    setMotorsSpeed(LM, RM)
    basic.pause(500)
    setMotorsSpeed(0, 0)

def on_bluetooth_connected():
    basic.show_icon(IconNames.HEART)
bluetooth.on_bluetooth_connected(on_bluetooth_connected)

def on_bluetooth_disconnected():
    basic.show_icon(IconNames.SAD)
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)

def init_speed():
    global LM, RM
    LM = 0
    RM = 0
def setMotorsSpeed(leftPower: number, rightPower: number):
    if leftPower == 0:
        maqueenPlusV2.control_motor_stop(maqueenPlusV2.MyEnumMotor.LEFT_MOTOR)
    elif leftPower > 0:
        maqueenPlusV2.control_motor(maqueenPlusV2.MyEnumMotor.LEFT_MOTOR,
            maqueenPlusV2.MyEnumDir.FORWARD,
            leftPower)
    else:
        maqueenPlusV2.control_motor(maqueenPlusV2.MyEnumMotor.LEFT_MOTOR,
            maqueenPlusV2.MyEnumDir.BACKWARD,
            abs(leftPower))
    if rightPower == 0:
        maqueenPlusV2.control_motor_stop(maqueenPlusV2.MyEnumMotor.RIGHT_MOTOR)
    elif rightPower > 0:
        maqueenPlusV2.control_motor(maqueenPlusV2.MyEnumMotor.RIGHT_MOTOR,
            maqueenPlusV2.MyEnumDir.FORWARD,
            rightPower)
    else:
        maqueenPlusV2.control_motor(maqueenPlusV2.MyEnumMotor.RIGHT_MOTOR,
            maqueenPlusV2.MyEnumDir.BACKWARD,
            abs(rightPower))
def get_gravity_values(message: str):
    global gravity_msg_values, gravity_power_forward, gravity_power_turn
    gravity_msg_values = message.substr(1, len(message))
    gravity_power_forward = parse_float(gravity_msg_values.substr(0, message.index_of("*") - 1))
    gravity_power_turn = parse_float(gravity_msg_values.substr(message.index_of("*"), 10))
    if gravity_power_forward != 0:
        if gravity_power_turn > 0:
            pass
        else:
            pass
    else:
        pass

def on_uart_data_received():
    global message2
    message2 = bluetooth.uart_read_until(serial.delimiters(Delimiters.COMMA))
    if message2.includes("G"):
        get_gravity_values(message2)
        bluetooth.uart_write_string("" + str(gravity_power_forward) + " - " + str(gravity_power_turn))
        setMotorsSpeed(gravity_power_forward * gravity_forward_increment,
            gravity_power_forward * gravity_forward_increment)
    else:
        if message2 == "F":
            acceleration(1, 1)
        elif message2 == "TL":
            acceleration(-1, 1)
        elif message2 == "TR":
            acceleration(1, -1)
        elif message2 == "R":
            acceleration(-1, -1)
        elif message2 == "HL":
            hardTurn(-1, 1)
        elif message2 == "HR":
            hardTurn(1, -1)
        elif message2 == "S":
            setMotorsSpeed(0, 0)
            init_speed()
bluetooth.on_uart_data_received(serial.delimiters(Delimiters.COMMA), on_uart_data_received)

message2 = ""
gravity_power_turn = 0
gravity_power_forward = 0
gravity_msg_values = ""
RM = 0
LM = 0
gravity_forward_increment = 0
hardTurnSpeed = 0
initialSpeed = 0
AccelerationVallue = 0
clignotant = 0
AccelerationVallue = 25
initialSpeed = 200
valeur_puissance_moteurs = 100
angle_left = -90
angle_right = 90
hardTurnSpeed = 100
gravity_forward_increment = 25
init_speed()
bluetooth.start_uart_service()
basic.show_leds("""
    . . # # .
    # . # . #
    . # # # .
    # . # . #
    . . # # .
    """)