/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    if(!nums || nums.length === 0) {
        return -1;
    }
    let l = 0, r = nums.length - 1;
    while(l <= r ) {
        let mid = l + ((r - l) >> 1)
        if(target === nums[mid]) return mid;
        if(nums[mid] > nums[r]) {
            if(target <= nums[r] || target > nums[r] && target >  nums[mid]) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        } else {
            if(target > nums[mid] && target <= nums[r]) {
                l = mid + 1;
            } else{
                r = mid - 1;
            }
        }
    }
    return -1;
};
