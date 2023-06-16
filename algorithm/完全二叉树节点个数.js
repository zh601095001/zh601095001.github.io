/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @typedef TreeNode
 * @property {number|undefined} val
 * @property {Object} left
 * @property {Object} right
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
function countNodes(root) {
    if(root == null){
        return 0;
    }
    const left = countLevel(root.left);
    const right = countLevel(root.right);
    if(left === right){
        return countNodes(root.right) + (1<<left);
    }else{
        return countNodes(root.left) + (1<<right);
    }
}
function countLevel(root){
    let level = 0;
    while(root != null){
        level++;
        root = root.left;
    }
    return level;
}
