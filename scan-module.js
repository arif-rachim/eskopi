
const path = require("path");
const fs = require("fs");

function scanIndexFile(directory) {
    return new Promise(resolve => {
        fs.readdir(directory, (err, files) => {
            (async() => {
                let result = [];
                for (const file of files) {
                    const filePath = path.join(directory,file);
                    const isDirectory = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
                    const isFile = fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
                    if(isDirectory){
                        const subFiles = await scanIndexFile(filePath);
                        result = [...result,...subFiles];
                    }
                    if(isFile && file === 'index.js'){
                        result.push(filePath);
                    }
                }
                resolve(result);
            })();
        });
    });
}

(async() => {
    let files = await scanIndexFile(path.join('src','module'));
    files = files.map(f => {
        const key = f.replace('src'+path.sep+'module','').replace('index.js','');
        let importKey = key.split(path.sep).filter(k => k.length > 0).join('_').split('-').join('_').split('@').join('');
        let mapPath = key.split(path.sep).filter(k => k.length > 0).join('/');
        let importPath = './module/'+mapPath+'/index';
        importKey = importKey || '_';
        return {
            importKey,importPath,mapPath
        }
    });

    const scriptFile = `
${files.map(f => `import ${f.importKey} from "${f.importPath}";`).join('\n')}
export default {
${files.map(f => `'${f.mapPath}' : ${f.importKey}`).join(',\n')}
}
    `;
    fs.writeFile(path.join('src','routing.js'),scriptFile, function (err) {
        if (err) return console.log(err);
    });
})();

