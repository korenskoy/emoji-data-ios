/**
 * Convert the emoji PNG assets to AVIF.
 *
 * Quality per folder, validated with SSIMULACRA2 on random samples,
 * flattened onto dark and light backgrounds (target score 85):
 *   img-apple-64:  quality 95 (q90 already fails the target on some files)
 *   img-apple-160: quality 85 (with a safety margin over the q70 threshold)
 * Both use effort 9 and 4:4:4 to keep hard emoji edges intact.
 *
 * Every converted .png is removed after the .avif is written and verified, so
 * the shipped folders end up containing only .avif files. An interrupted run
 * can be restarted: existing .avif files are validated and their leftover .png
 * is dropped. Pass --force to re-encode everything.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const FOLDERS = {
  'img-apple-64': 95,
  'img-apple-160': 85,
};
const AVIF_OPTIONS = {
  effort: 9,
  chromaSubsampling: '4:4:4',
};
const force = process.argv.includes('--force');

const convertFolder = async (folder, quality) => {
  const files = fs.readdirSync(folder)
    .filter((file) => file.endsWith('.png'))
    .sort();

  let index = 0;
  let converted = 0;
  let skipped = 0;
  let failed = 0;

  const worker = async () => {
    while (index < files.length) {
      const file = files[index++];
      const input = path.join(folder, file);
      const output = path.join(folder, file.replace(/\.png$/, '.avif'));

      try {
        if (!force && fs.existsSync(output)) {
          // Resumed file: validate it and drop the leftover source.
          await sharp(output).metadata();
          fs.unlinkSync(input);
          skipped++;
          continue;
        }

        const inputMeta = await sharp(input).metadata();
        await sharp(input)
          .avif({ ...AVIF_OPTIONS, quality })
          .toFile(output);

        const outputMeta = await sharp(output).metadata();
        if (outputMeta.width !== inputMeta.width || outputMeta.height !== inputMeta.height) {
          throw new Error(`dimension mismatch: ${inputMeta.width}x${inputMeta.height} -> ${outputMeta.width}x${outputMeta.height}`);
        }

        fs.unlinkSync(input);
        converted++;

        if ((converted + skipped + failed) % 100 === 0) {
          console.log(`${folder}: ${converted + skipped + failed}/${files.length}`);
        }
      } catch (error) {
        failed++;
        console.error(`Failed: ${input} (${error.message})`);
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(os.cpus().length, files.length) }, worker)
  );

  const leftover = fs.readdirSync(folder).filter((file) => file.endsWith('.png')).length;
  console.log(`${folder}: ${converted} converted, ${skipped} skipped, ${failed} failed, ${leftover} png left`);
};

const folderSize = (folder) => fs.readdirSync(folder)
  .filter((file) => file.endsWith('.avif'))
  .reduce((sum, file) => sum + fs.statSync(path.join(folder, file)).size, 0);

(async () => {
  for (const [folder, quality] of Object.entries(FOLDERS)) {
    console.log(`${folder}: AVIF quality ${quality}, effort ${AVIF_OPTIONS.effort}, ${AVIF_OPTIONS.chromaSubsampling}`);
    await convertFolder(folder, quality);
    console.log(`${folder}: ${(folderSize(folder) / 10 ** 6).toFixed(1)} MB of AVIF`);
  }
})();
