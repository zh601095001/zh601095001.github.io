import fs from "fs";

const isDir = (dirPath) => {
    return fs.statSync(dirPath).isDirectory();
};
export default (() => {
    const root = "./game/"
    let dirs = fs.readdirSync(root);
    dirs = dirs
        .filter(dir => isDir(root + dir))
        .sort((a, b) => {
            return Date.parse(a) - Date.parse(b);
        });
    return dirs.map(dir => {
        let subDirs = fs.readdirSync(root + dir);
        const items = subDirs.filter(subDir => {
            return subDir.endsWith(".md");
        }).map(subDir => {
            const fileName = subDir.replace(/\.md$/,"")
            return {
                text: fileName,
                link: `/game/${dir}/${fileName}`
            };
        });
        return {
            text: dir,
            collapsed: false,
            items,
        };
    });
})();
