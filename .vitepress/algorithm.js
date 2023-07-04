import fs from "fs";

const isDir = (dirPath) => {
    return fs.statSync(dirPath).isDirectory();
};
export default (() => {
    const root = "./algorithm/"
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
                link: `/algorithm/${dir}/${fileName}`
            };
        });
        try{
            const folderTimeStamp = Date.parse(dir)
            if (!folderTimeStamp){
                throw Error("算法目录的文件名格式有问题，必须为YY-MM-DD")
            }
            const today = new Date(Date.now())
            today.setHours(0)
            today.setMinutes(0)
            today.setSeconds(0)
            today.setMilliseconds(0)
            const todayTimeStamp = Date.parse(today.toString())
            return {
                text: dir,
                collapsed: todayTimeStamp !== folderTimeStamp,
                items,
            };
        }catch (e) {
            console.log(e)
            return {
                text: dir,
                collapsed: false,
                items,
            };
        }

    });
})();
