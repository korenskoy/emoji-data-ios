const fs = require('fs');
const initialData = require('./initial-data.json');
const data = require('./emoji.json').filter(emoji => {
    return initialData.categoryId[emoji.category] !== undefined || !emoji.has_img_apple
});

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
