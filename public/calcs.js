// calculates the argument of perihelion
export function arg_peri(long_peri, long_node) {
    return long_peri - long_node;
}

export function convertToJED(day, month, year, hour) {
    // Adjust month and year for January and February
    if (month < 3) {
        month += 12;
        year -= 1;
    }

    // Calculate Julian Day
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    
    const JD = Math.floor(365.25 * (year + 4716)) +
                Math.floor(30.6001 * (month + 1)) +
                day + B - 1524.5;

    // Convert to Julian Ephemeris Date
    const JED = JD + (hour / 24);

    return JED;
}

export function get_T(t) {
    return (t - 2451545.0)/36525;
}

// calculates the adjusted mean longitude corresponding to J2000
export function mean_long(mean_long, mean_long_change, T) {
    return mean_long + mean_long_change * T;
}

// calculates the mean anomaly
export function mean_anomaly(mean_long, long_peri) {
    let M = mean_long - long_peri;
    M % 360;
    if (M > 180)
        M -=360;
    return M;
}

// converts an angle from radians to degrees
export function rad_to_deg(angle) {
    return angle * (180 / Math.PI)
}

// finds a close approximation for E given M and e, using the newton-raphson
// numerical method
export function newton_raphson_kepler(M, e, tol=1e-10, max_iter=100) {
    let E;
    e < 0.8 ? E = M : E = Math.PI;

    for (let i = 0; i < max_iter; i++) {
        let f_E = E - e * Math.sin(E) - M;
        let f_prime_E = 1 - e * Math.cos(E);
        let E_new = E - (f_E/f_prime_E);

        if (Math.abs(E_new - E) < tol)
            return E_new

        E = E_new
    }

    return E
}

// gets the position relative to the orbital plane (2-d)
export function get_orbital_pos(E, e, a) {
    let x = a(Math.cos(E) - e);
    let y = a(Math.sqrt(1 - e*e))*Math.sin(E);
    return [x, y, 0]
}

// gets the position relative to the equatorial plane and the equinox (3-d)
export function get_relative_pos(orbital_pos, i, long_node, arg_peri) {
    let x = (Math.cos(arg_peri)*Math.cos(long_node) - Math.sin(arg_peri)*Math.sin(long_node)*Math.cos(i))*orbital_pos[0];
    x += (-Math.sin(arg_peri)*Math.cos(long_node) - Math.cos(arg_peri)*Math.sin(long_node)*Math.cos(i)) * orbital_pos[1];

    let y = (Math.cos(arg_peri)*Math.sin(long_node) + Math.sin(arg_peri)*Math.cos(long_node)*Math.cos(i))*orbital_pos[0];
    y += (-Math.sin(arg_peri)*Math.sin(long_node) + Math.cos(arg_peri)*Math.cos(long_node)*Math.cos(i)) * orbital_pos[1];

    let z = Math.sin(arg_peri)*Math.sin(i)*orbital_pos[0] + Math.cos(arg_peri)*Math.sin(i)*orbital_pos[1];

    return [x, y, z];
}