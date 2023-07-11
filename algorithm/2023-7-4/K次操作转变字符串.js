function canConvertString(s, t, k) {
    if (s.length !== t.length) {
        return false;
    }
    // 保存每个元素中，切换相同次数的元素计数;
    // 例如：
    //      "ab" -> "bc"
    //       a -> b: 1次
    //       b -> c: 1次
    //      此时，切换一次可以转变的元素有2个，即 counts[1] = 2
    let counts = new Array(26).fill(0);
    let length = s.length;
    for (let i = 0; i < length; i++) {
        let difference = t.charCodeAt(i) - s.charCodeAt(i); // 根据字符编码计算需要切换次数
        if (difference < 0) {
            difference += 26;
        }
        counts[difference]++;
    }
    for (let i = 1; i < 26; i++) {
        let maxConvert = i + 26 * (counts[i] - 1); // 计算每个转换次数是否都包含在k次中，比如： counts[1] = 2, 那么，要想切换一次出现两次，那么需要有 1, 1+26,即必须k>=27
        if (maxConvert > k) {
            return false;
        }
    }
    return true;
}

console.log(canConvertString("abc", "bcd", 10));
