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
 * @param {TreeNode | null} root
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

/**
 * Test
 */
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}
// [1,2,3,4,5,6]
class CBTInserter {
    list = []
    idx = 0
    constructor(root) {
        this.list.push(root)
        let cur = 0
        while (cur < this.list.length) {
            const node = this.list[cur]
            if (node.left != null) this.list.push(node.left)
            if (node.right != null) this.list.push(node.right)
            cur++
        }
    }
    insert(val) {
        const node = new TreeNode(val)
        while (this.list[this.idx].left != null && this.list[this.idx].right != null) this.idx++
        const fa = this.list[this.idx]
        if (fa.left == null) fa.left = node
        else if (fa.right == null) fa.right = node
        this.list.push(node)
        return fa.val
    }
    get_root(){
        return this.list[0]
    }
}
const arr = [1,2,3,4,5,6]
const bsTree = new CBTInserter(new TreeNode(arr.shift(),null,null))
arr.forEach(item=>{
    bsTree.insert(item)
})
console.log(bsTree);
console.log(countNodes(bsTree.get_root()));
