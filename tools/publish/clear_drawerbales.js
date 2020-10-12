const path = require('path');
const fs = require('fs');
const process = require('process');


function _doRemoveImages(drawable_path) {
    const files = fs.readdirSync(drawable_path);
    if (!files) return;

    for (const subFile of files) {
        if (!subFile) continue;
        if (subFile.indexOf('images_') != 0) continue;

        const file_path = path.join(drawable_path, subFile)
        fs.unlinkSync(file_path);
    }
}

function main() {
    const project_name = process.argv[2];
    const res_path = path.join(__dirname, `../../${project_name}/android/app/src/main/res`);

    if (!fs.existsSync(res_path)) return;

    const files = fs.readdirSync(res_path);
    if (!files) return;

    for (const subFile of files) {
        if (!subFile) continue;
        if (subFile.indexOf('drawable') != 0) continue;

        _doRemoveImages(path.join(res_path, subFile));
    }

}

main();