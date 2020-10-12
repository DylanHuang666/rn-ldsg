const fs = require('fs');
const path = require('path');


function isWebp(bytes) {
    if (!bytes) return false;
    if (bytes.length < 10) return false;

    // RIFF
    // 52 49 46 46
    if (bytes[0] != 0x52 || bytes[1] != 0x49 || bytes[2] != 0x46 || bytes[3] != 0x46) {
        return false;
    }

    const fileSize = (bytes[7] << 24 | bytes[6] << 16 | bytes[5] << 8 | bytes[4]) + 8;

    return fileSize == bytes.length;
}

function checkIsVP8X(bytes) {
    if (!bytes) return false;
    if (bytes.length < 0x1E) return false;

    // VP8X
    // 56 50 38 58
    if (bytes[0xc] != 0x56 || bytes[0xd] != 0x50 || bytes[0xe] != 0x38 || bytes[0xf] != 0x58) {
        return false;
    }

    // Reserved (Rsv): 2 bits
    // SHOULD be 0.
    // ICC profile (I): 1 bit
    // Set if the file contains an ICC profile.
    // Alpha (L): 1 bit
    // Set if any of the frames of the image contain transparency information ("alpha").
    // EXIF metadata (E): 1 bit
    // Set if the file contains EXIF metadata.
    // XMP metadata (X): 1 bit
    // Set if the file contains XMP metadata.
    // Animation (A): 1 bit
    // Set if this is an animated image. Data in 'ANIM' and 'ANMF' chunks should be used to control the animation.
    // Reserved (R): 1 bit
    // SHOULD be 0.
    // const rsv = bytes[0x14] & 0b11;
    // const icc = (bytes[0x14] & 0b100) >> 2;
    // const alpha = (bytes[0x14] & 0b1000) >> 3;
    // const exif = (bytes[0x14] & 0b10000) >> 4;
    // const xmp = (bytes[0x14] & 0b100000) >> 5;
    // const animation = (bytes[0x14] & 0b1000000) >> 6;
    // const r = (bytes[0x14] & 0b10000000) >> 7;

    // console.log(rsv, icc, alpha, exif, xmp, animation, r);

    return true;
}

function setANIMLoop(bytes, loop) {
    if (!isWebp(bytes)) {
        // console.log('not webp file');
        return false;
    }
    if (!checkIsVP8X(bytes)) {
        // console.log('not webp vp8x file');
        return false;
    }

    if (bytes.length < 0x2c) {
        return false;
    }

    // ANIM
    // 41 4E 49 4D
    const srcLoop = bytes[0x2A] | (bytes[0x2B] << 8);
    if (srcLoop == loop) {
        // console.log('same loop count');
        return false;
    }

    bytes[0x2A] = loop & 0xff;
    bytes[0x2B] = loop >> 8;
    return true;
}

function readWebpBytes(file) {
    const buf = fs.readFileSync(file);

    return new Uint8Array(buf);
}

function saveWebpBytes(file, bytes) {
    fs.writeFileSync(file, bytes);
}

function doSetAndSaveWebpLoop(file, loop, dstFile) {
    const bytes = readWebpBytes(file);
    if (!setANIMLoop(bytes, loop)) {
        return false;
    }

    saveWebpBytes(dstFile, bytes);

    return true;
}

function _doStateSync(s) {
    try {
        return fs.statSync(s);
    } catch (error) {
    }

    return null;
}

function _mkDirs(p) {
    if (!p) return;
    if (fs.existsSync(p)) return;

    const pp = path.dirname(p);
    _mkDirs(pp);

    fs.mkdirSync(p);
}

function setAndSaveWebpLoop(s, loop, dstFolder) {
    if (!s) return;
    if (!fs.existsSync(s)) return;

    const st = _doStateSync(s);
    if (!st) return;

    if (st.isFile() || st.isSymbolicLink()) {
        _mkDirs(dstFolder);

        doSetAndSaveWebpLoop(s, loop, path.join(dstFolder, path.basename(s)));
        return;
    }

    const files = fs.readdirSync(s);
    if (!files) return;

    for (let file of files) {
        setAndSaveWebpLoop(path.join(s, file), loop, dstFolder);
    }
}

// const file = 'E:/新建文件夹 (2)/qiqiu.webp';
// doSetAndSaveWebpLoop(file, 1);

setAndSaveWebpLoop('E:/新建文件夹 (2)/高级-以往/高级-以往', 0, 'e:/新建文件夹 (2)/temp');
// setAndSaveWebpLoop('E:/新建文件夹/礼物汇总5.15-7.28', 0, 'e:/新建文件夹/temp');