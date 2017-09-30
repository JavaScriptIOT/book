var y_n_1 = 0.0;
function PID(x_n, x_n_1, x_n_2, Kp, Ki, Kd) {
    var y_n, A0, A1, A2;
    y_n = Kp * x_n + Ki * (x_n + x_n_1 + x_n_2) + Kd * (x_n + x_n_2 - 2 * x_n_1);
    return y_n;
}

function moisture() {
    var moisture = 0;
    var error = 0;
    var error_d = 0;
    var error_d_d = 0;

    setInterval(function () {
        moisture = fpga.sht1x_get_moisture(SHT1X_1);
        error_d_d = error_d;
        error_d = error;
        error = (target_moisture - moisture) / 100;
        console.log("error = %f\t", error);
        console.log("moisture is %.2f%%\t", moisture);
        if (moisture < target_moisture - target_moisture * threshold) {
            humidifier_on();
            humidifier_regulating(0.1 + PID(error, error_d, error_d_d, 2, -0.2, 3));
            console.log("delta %f\n", error);
        }
        else if (moisture > target_moisture + target_moisture * threshold) {
            console.log("moisture goes down\n");
            humidifier_off();
            exhaust_on();
            exhaust_regulating(PID(error, error_d, error_d_d, 2, 0, 0));
            console.log("delta %f\n", error);
        }
        else {
            console.log("moisture keeps\n");
            humidifier_off();
            exhaust_off();
        }
    }, 1000);
};

function temperature() {
    var temperature;
    var error = 0;
    var error_d = 0;
    var error_d_d = 0;
    var temperature_box;

    setInterval(function () {
        temperature = sht1x_get_temperature(SHT1X_1);
        temperature_box = sht1x_get_temperature(SHT1X_0);
        previous_temp = temperature;
        if (previous_temp - temperature > 5)
            return;
        if (temperature > 38 || temperature < 0)
            return;
        error_d_d = error_d;
        error_d = error;
        error = target_temperature - temperature;
        console.log("error = %f\t", error);
        console.log("temperature is %.2fC\t", temperature);
        if (temperature < target_temperature - 0.12) {
            console.log("temperature goes up\n");
            semi_cooler_on();
            semi_warmer_regulating(PID(error, error_d, error_d_d, 0.03, temperature_box / 250, 0.2));
            console.log("delta %f\n", error);
        }
        else if (temperature > target_temperature - 0.12) {
            console.log("temperature goes down\n");
            semi_cooler_on();
            semi_cooler_regulating(-PID(error, error_d, error_d_d, 0.3, temperature_box / 25, 2));
            console.log("delta %f\n", error);
        }
        else {
            semi_cooler_off();
            console.log("temperature keeps\n");
        }
    }, 1000);
};
