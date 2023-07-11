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
            const fileName = subDir.replace(/\.md$/, "")
            return {
                text: fileName,
                link: `/algorithm/${dir}/${fileName}`
            };
        });
        if (dir.endsWith("&")) {
            return {
                text: dir.substring(0, dir.length - 1),
                collapsed: false,
                items,
            };
        }

        const folderTimeStamp = Date.parse(dir)
        if (!folderTimeStamp) {
            console.log("算法目录的文件名格式有问题，必须为YY-MM-DD")
            return {
                text: dir,
                collapsed: false,
                items,
            };
        }
        const today = new Date(Date.now())
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)
        const todayTimeStamp = Date.parse(today.toString())
        const yesterdayTimeStamp = todayTimeStamp - 24 * 60 * 60 * 1000
        return {
            text: dir,
            collapsed: !(todayTimeStamp === folderTimeStamp || yesterdayTimeStamp === folderTimeStamp),
            items,
        };

    });
})();
