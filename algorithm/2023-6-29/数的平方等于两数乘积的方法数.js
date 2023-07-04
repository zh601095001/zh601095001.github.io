/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function numTriplets(nums1, nums2) {
    const map1 = new Map();
    const map2 = new Map();
    for (let num of nums1) {
        const count = (map1.get(num) || 0) + 1;
        map1.set(num, count);
    }
    for (let num of nums2) {
        const count = (map2.get(num) || 0) + 1;
        map2.set(num, count);
    }
    return getTriplets(map1, map2) + getTriplets(map2, map1);
}

function getTriplets(map1, map2) {
    let triplets = 0;
    const keys1 = [...map1.keys()];
    const keys2 = [...map2.keys()];
    for (let num1 of keys1) {
        const count1 = map1.get(num1);
        const square = num1 * num1;
        for (let num2 of keys2) {
            if (square % num2 === 0 && square / num2 <= Number.MAX_VALUE) {
                const num3 = square / num2;
                if (num2 === num3) {
                    const count2 = map2.get(num2);
                    // 排列组合： (C_n)^2
                    const curTriplets = count1 * count2 * (count2 - 1) / 2;
                    triplets += curTriplets;
                } else if (num2 < num3 && keys2.indexOf(num3) !== -1) {
                    const count2 = map2.get(num2), count3 = map2.get(num3);
                    const curTriplets = count1 * count2 * count3;
                    triplets += curTriplets;
                }
            }
        }
    }
    return triplets;
}

console.log(numTriplets([7,4],[5,2,8,9])) // 1
