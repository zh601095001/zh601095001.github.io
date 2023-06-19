/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function nextPermutation(nums) {
    let i = nums.length - 2;
    // 从后往前遍历 直到找到前一个数比后一个数小的情况 例如 [4, 5, 2, 6, 3, 1]中就是2 下标为2 (即 nums[i] = nums[2] = 2)
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    if (i >= 0) {
        let j = nums.length - 1;
        // 继续从后往前遍历（因为此时右边的排列为倒序） 找到nums[i]右边比nums[i]大一点点的数 例如 [4, 5, 2, 6, 3, 1]中就是3 下标为4 (即 nums[i] = nums[4] = 3)
        while (j >= 0 && nums[i] >= nums[j]) {
            j--;
        }
        swap(nums, i, j); // 交换这两个数(例如：[4, 5, 2, 6, 3, 1]->[4, 5, 3, 6, 2, 1])，即可得到一个比原nums小的数
    }
    reverse(nums, i + 1); // 此时由于i的右边顺序是逆序,我们需要反转一下：[4, 5, 3, 6, 2, 1] -> [4, 5, 3, 1, 2, 6]
}

function swap(nums, i, j) {
    let temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

/**
 * 从数组的某个位置开始，将右侧部分反转，先头尾交换，然后缩小范围继续头尾交换
 * 例如 reverse([1,2,3,4,5,6],2)
 *      v     v          v v
 * [1,2,3,4,5,6]->[1,2,6,4,5,3] -> [1,2,6,5,4,3]
 */
function reverse(nums, start) {
    let left = start, right = nums.length - 1;
    while (left < right) {
        swap(nums, left, right);
        left++;
        right--;
    }
}

// Test
const arr = [4, 5, 2, 6, 3, 1];
nextPermutation(arr);
console.log(arr); // [ 4, 5, 3, 1, 2, 6 ]
