// Perceptual image hash calculation tool based on algorithm descibed in
// Block Mean Value Based Image Perceptual Hashing by Bian Yang, Fan Gu and Xiamu Niu
//
// Copyright 2014 Commons Machinery http://commonsmachinery.se/
// Distributed under an MIT license, please see LICENSE in the top dir.

const one_bits = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];

/* Calculate the hamming distance for two hashes in hex format */
const hammingDistance = function (hash1: string, hash2: string) {
    let d = 0;

    if (hash1.length !== hash2.length) {
        throw new Error("Can't compare hashes with different length");
    }

    for (let i = 0; i < hash1.length; i++) {
        const n1 = parseInt(hash1[i], 16);
        const n2 = parseInt(hash2[i], 16);
        d += one_bits[n1 ^ n2];
    }
    return d;
};

const median = function (data: Uint8Array | Uint8ClampedArray | number[]) {
    let mdarr = data.slice(0);
    mdarr.sort((a: number, b: number) => a - b);
    if (mdarr.length % 2 === 0) {
        return (mdarr[mdarr.length / 2 - 1] + mdarr[mdarr.length / 2]) / 2.0;
    }
    return mdarr[Math.floor(mdarr.length / 2)];
};

const translate_blocks_to_bits = function (blocks: Uint8Array | Uint8ClampedArray | number[], pixels_per_block: number) {
    const half_block_value = pixels_per_block * 256 * 3 / 2;
    const bandsize = blocks.length / 4;

    // Compare medians across four horizontal bands
    for (let i = 0; i < 4; i++) {
        const m = median(blocks.slice(i * bandsize, (i + 1) * bandsize));
        for (let j = i * bandsize; j < (i + 1) * bandsize; j++) {
            const v = blocks[j];

            // Output a 1 if the block is brighter than the median.
            // With images dominated by black or white, the median may
            // end up being 0 or the max value, and thus having a lot
            // of blocks of value equal to the median.  To avoid
            // generating hashes of all zeros or ones, in that case output
            // 0 if the median is in the lower value space, 1 otherwise
            blocks[j] = Number(v > m || (Math.abs(v - m) < 1 && m > half_block_value));
        }
    }
};

const bits_to_hexhash = function (bitsArray: Uint8Array | Uint8ClampedArray | number[]): string {
    const hex = [];
    for (let i = 0; i < bitsArray.length; i += 4) {
        const nibble = bitsArray.slice(i, i + 4);
        hex.push(parseInt(nibble.join(''), 2).toString(16));
    }

    return hex.join('');
};

const bmvbhash_even = function (data: ImageData, bits: number): string {
    const blocksize_x = Math.floor(data.width / bits);
    const blocksize_y = Math.floor(data.height / bits);

    const result = [];

    for (let y = 0; y < bits; y++) {
        for (let x = 0; x < bits; x++) {
            let total = 0;

            for (let iy = 0; iy < blocksize_y; iy++) {
                for (let ix = 0; ix < blocksize_x; ix++) {
                    const cx = x * blocksize_x + ix;
                    const cy = y * blocksize_y + iy;
                    const ii = (cy * data.width + cx) * 4;

                    const alpha = data.data[ii + 3];
                    if (alpha === 0) {
                        total += 765;
                    } else {
                        total += data.data[ii] + data.data[ii + 1] + data.data[ii + 2];
                    }
                }
            }

            result.push(total);
        }
    }

    translate_blocks_to_bits(result, blocksize_x * blocksize_y);
    return bits_to_hexhash(result);
};

const bmvbhash = function (data: ImageData, bits: number): string {
    const result = [];

    let weight_top, weight_bottom, weight_left, weight_right;
    let block_top, block_bottom, block_left, block_right;
    const blocks = [];

    const even_x = data.width % bits === 0;
    const even_y = data.height % bits === 0;

    if (even_x && even_y) {
        return bmvbhash_even(data, bits);
    }

    // initialize blocks array with 0s
    for (let i = 0; i < bits; i++) {
        blocks.push([]);
        for (let j = 0; j < bits; j++) {
            blocks[i].push(0);
        }
    }

    const block_width = data.width / bits;
    const block_height = data.height / bits;

    for (let y = 0; y < data.height; y++) {
        if (even_y) {
            // don't bother dividing y, if the size evenly divides by bits
            block_top = block_bottom = Math.floor(y / block_height);
            weight_top = 1;
            weight_bottom = 0;
        } else {
            const y_mod = (y + 1) % block_height;
            const y_frac = y_mod - Math.floor(y_mod);
            const y_int = y_mod - y_frac;

            weight_top = (1 - y_frac);
            weight_bottom = (y_frac);

            // y_int will be 0 on bottom/right borders and on block boundaries
            if (y_int > 0 || (y + 1) === data.height) {
                block_top = block_bottom = Math.floor(y / block_height);
            } else {
                block_top = Math.floor(y / block_height);
                block_bottom = Math.ceil(y / block_height);
            }
        }

        for (let x = 0; x < data.width; x++) {
            const ii = (y * data.width + x) * 4;

            let avgvalue, alpha = data.data[ii + 3];
            if (alpha === 0) {
                avgvalue = 765;
            } else {
                avgvalue = data.data[ii] + data.data[ii + 1] + data.data[ii + 2];
            }

            if (even_x) {
                block_left = block_right = Math.floor(x / block_width);
                weight_left = 1;
                weight_right = 0;
            } else {
                const x_mod = (x + 1) % block_width;
                const x_frac = x_mod - Math.floor(x_mod);
                const x_int = x_mod - x_frac;

                weight_left = (1 - x_frac);
                weight_right = x_frac;

                // x_int will be 0 on bottom/right borders and on block boundaries
                if (x_int > 0 || (x + 1) === data.width) {
                    block_left = block_right = Math.floor(x / block_width);
                } else {
                    block_left = Math.floor(x / block_width);
                    block_right = Math.ceil(x / block_width);
                }
            }

            // add weighted pixel value to relevant blocks
            blocks[block_top][block_left] += avgvalue * weight_top * weight_left;
            blocks[block_top][block_right] += avgvalue * weight_top * weight_right;
            blocks[block_bottom][block_left] += avgvalue * weight_bottom * weight_left;
            blocks[block_bottom][block_right] += avgvalue * weight_bottom * weight_right;
        }
    }

    for (let i = 0; i < bits; i++) {
        for (let j = 0; j < bits; j++) {
            result.push(blocks[i][j]);
        }
    }

    translate_blocks_to_bits(result, block_width * block_height);
    return bits_to_hexhash(result);
};

const blockhashData = function (imgData: ImageData, bits: number, method: 1 | 2) {
    let hash;

    if (method === 1) {
        hash = bmvbhash_even(imgData, bits);
    } else if (method === 2) {
        hash = bmvbhash(imgData, bits);
    } else {
        throw new Error("Bad hashing method");
    }

    return hash;
};

export {
    hammingDistance,
    blockhashData,
}
