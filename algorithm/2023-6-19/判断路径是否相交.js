/**
 * @param {string} path
 * @return {boolean}
 */
var isPathCrossing = function (path) {
    const location = [0, 0];
    const map = new Map()
    map.set([0,0].toString(),true)
    for (let direction of path) {
        switch (direction) {
        case "N":
            location[1] += 1;
            break;
        case "S":
            location[1] -= 1;
            break;
        case "W":
            location[0] -= 1;
            break;
        case "E":
            location[0] += 1;
        }
        if (map.has(location.toString())) return true
        map.set(location.toString(),true)
    }
    return false
};
console.log(isPathCrossing("NES"));
