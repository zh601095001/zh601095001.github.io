/**
 * @param {string} path
 * @return {boolean}
 */
var isPathCrossing = function (path) {
    const location = [0, 0];
    const map = new Map()
    map[[0,0]] = true
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
        if (map.has(location)) return true
        map.set(location,true)
    }
};
console.log(isPathCrossing("NESWW"));
