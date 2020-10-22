const fs = require('fs');
const initialData = require('./initial-data.json');
const data = require('./emoji.json').filter(emoji => {
    return initialData.categoryId[emoji.category] !== undefined || !emoji.has_img_apple
});
const emojiPresentationSelectorForce = [
    '0023', '002a', '0030', '0031', '0032', '0033', '0034', '0035', '0036', '0037', '0038', '0039', '00a9', '00ae',
    '203c', '2049', '2122', '2139', '2194', '2195', '2196', '2197', '2198', '2199', '21a9', '21aa', '231a', '231b',
    '2328', '23cf', '23e9', '23ea', '23ed', '23ee', '23ef', '23f1', '23f2', '23f3', '23f8', '23f9', '23fa', '24c2',
    '25aa', '25ab', '25b6', '25c0', '25fb', '25fc', '25fd', '25fe', '2600', '2601', '2602', '2603', '2604', '260e',
    '2611', '2614', '2615', '2618', '261d', '2620', '2622', '2623', '2626', '262a', '262e', '262f', '2638', '2639',
    '263a', '2640', '2642', '2648', '2649', '264a', '264b', '264c', '264d', '264e', '264f', '2650', '2651', '2652',
    '2653', '265f', '2660', '2663', '2665', '2666', '2668', '267b', '267e', '267f', '2692', '2693', '2694', '2695',
    '2696', '2697', '2699', '269b', '269c', '26a0', '26a1', '26a7', '26aa', '26ab', '26b0', '26b1', '26bd', '26be',
    '26c4', '26c5', '26c8', '26cf', '26d1', '26d3', '26d4', '26e9', '26ea', '26f0', '26f1', '26f2', '26f3', '26f4',
    '26f5', '26f7', '26f8', '26f9', '26fa', '26fd', '2702', '2708', '2709', '270c', '270d', '270f', '2712', '2714',
    '2716', '271d', '2721', '2733', '2734', '2744', '2747', '2753', '2757', '2763', '2764', '27a1', '2934', '2935',
    '2b05', '2b06', '2b07', '2b1b', '2b1c', '2b50', '2b55', '3030', '303d', '3297', '3299', '1f004', '1f170', '1f171',
    '1f17e', '1f17f', '1f202', '1f21a', '1f22f', '1f237', '1f30d', '1f30e', '1f30f', '1f315', '1f31c', '1f321', '1f324',
    '1f325', '1f326', '1f327', '1f328', '1f329', '1f32a', '1f32b', '1f32c', '1f336', '1f378', '1f37d', '1f393', '1f396',
    '1f397', '1f399', '1f39a', '1f39b', '1f39e', '1f39f', '1f3a7', '1f3ac', '1f3ad', '1f3ae', '1f3c2', '1f3c4', '1f3c6',
    '1f3ca', '1f3cb', '1f3cc', '1f3cd', '1f3ce', '1f3d4', '1f3d5', '1f3d6', '1f3d7', '1f3d8', '1f3d9', '1f3da', '1f3db',
    '1f3dc', '1f3dd', '1f3de', '1f3df', '1f3e0', '1f3ed', '1f3f3', '1f3f5', '1f3f7', '1f408', '1f415', '1f41f', '1f426',
    '1f43f', '1f441', '1f442', '1f446', '1f447', '1f448', '1f449', '1f44d', '1f44e', '1f453', '1f46a', '1f47d', '1f4a3',
    '1f4b0', '1f4b3', '1f4bb', '1f4bf', '1f4cb', '1f4da', '1f4df', '1f4e4', '1f4e5', '1f4e6', '1f4ea', '1f4eb', '1f4ec',
    '1f4ed', '1f4f7', '1f4f9', '1f4fa', '1f4fb', '1f4fd', '1f508', '1f50d', '1f512', '1f513', '1f549', '1f54a', '1f550',
    '1f551', '1f552', '1f553', '1f554', '1f555', '1f556', '1f557', '1f558', '1f559', '1f55a', '1f55b', '1f55c', '1f55d',
    '1f55e', '1f55f', '1f560', '1f561', '1f562', '1f563', '1f564', '1f565', '1f566', '1f567', '1f56f', '1f570', '1f573',
    '1f574', '1f575', '1f576', '1f577', '1f578', '1f579', '1f587', '1f58a', '1f58b', '1f58c', '1f58d', '1f590', '1f5a5',
    '1f5a8', '1f5b1', '1f5b2', '1f5bc', '1f5c2', '1f5c3', '1f5c4', '1f5d1', '1f5d2', '1f5d3', '1f5dc', '1f5dd', '1f5de',
    '1f5e1', '1f5e3', '1f5e8', '1f5ef', '1f5f3', '1f5fa', '1f610', '1f687', '1f68d', '1f691', '1f694', '1f698', '1f6ad',
    '1f6b2', '1f6b9', '1f6ba', '1f6bc', '1f6cb', '1f6cd', '1f6ce', '1f6cf', '1f6e0', '1f6e1', '1f6e2', '1f6e3', '1f6e4',
    '1f6e5', '1f6e9', '1f6f0', '1f6f3',
];

data.sort((a, b) => {
    const as = initialData.categoryId[a.category].position;
    const bs = initialData.categoryId[b.category].position;

    if (as === bs) {
        return a.sort_order - b.sort_order;
    }

    return as - bs;
});

const emojis = data.reduce((result, emoji) => {
    const categoryUid = emoji.category;

    if (!result.categoryId[categoryUid]) {
        throw new Error('Undefined category: ' + categoryUid);
    }
    const categoryId = result.categoryId[categoryUid].id;
    result.categories[categoryId].emojis.push(emoji.short_name);

    result.emojis[emoji.short_name] = emoji;

    return result;
}, initialData);

delete emojis.categoryId;

const json = emojis.categories.reduce((result, category) => {
    result.push([category.id, category.name]);
    result.push(category.emojis.map((id) => {
        const emoji = emojis.emojis[id];

        return [
            emoji.unified,
            emoji.short_name,
        ];
    }));

    return result;
}, [])

fs.writeFile('emoji-data.json', JSON.stringify(json), 'utf8', (err) => {
    if (err) {
        throw err;
    }

    console.log('The file has been saved!');
});

emojiPresentationSelectorForce.forEach((code) => {
    fs.exists(`./img-apple-64/${code}-fe0f.png`, (exists) => {
        if (exists) {
            fs.copyFileSync(`./img-apple-64/${code}-fe0f.png`, `./img-apple-64/${code}.png`);
        }
    });
    fs.exists(`./img-apple-160/${code}-fe0f.png`, (exists) => {
        if (exists) {
            fs.copyFileSync(`./img-apple-160/${code}-fe0f.png`, `./img-apple-160/${code}.png`);
        }
    });
});
