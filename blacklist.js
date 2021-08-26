const emojiBlackList = '🏳️‍🌈,🏴‍☠️,⚕️,🔯,🕎,✡️,👩‍👩‍👧‍👧,👩‍👩‍👦‍👦,👩‍👩‍👧‍👦,👩‍👩‍👧,👩‍👩‍👦,👨‍👨‍👧‍👧,👨‍👨‍👦‍👦,👨‍👨‍👧‍👦,👨‍👨‍👧,👨‍👨‍👦,👪,👯‍♀️,👯‍♂️,👯,💃,🧜‍♀️,🧚‍♀️,👰‍♂️,🤘,🤟,☠️'.split(',')
const emojiGrayList = '👁️‍🗨️,👁️,🖕,🇮🇱,💋,🧘‍♀️,🤸‍♀️'.split(',').concat(emojiBlackList)
const emojiBlackListHex = emojiBlackList.map(convertEmojiToHex)

module.exports = {
  emojiBlackList,
  emojiGrayList,
  emojiBlackListHex,
}

function convertEmojiToHex(emoji) {
  let code;

  if (emoji.length === 1) {
    code = emoji.charCodeAt(0).toString(16).padStart(4, '0');
  } else {
    const pairs = [];
    for (let i = 0; i < emoji.length; i++) {
      if (emoji.charCodeAt(i) >= 0xd800 && emoji.charCodeAt(i) <= 0xdbff) {
        if (emoji.charCodeAt(i + 1) >= 0xdc00 && emoji.charCodeAt(i + 1) <= 0xdfff) {
          pairs.push(
            (emoji.charCodeAt(i) - 0xd800) * 0x400
              + (emoji.charCodeAt(i + 1) - 0xdc00) + 0x10000,
          );
        }
      } else if (emoji.charCodeAt(i) < 0xd800 || emoji.charCodeAt(i) > 0xdfff) {
        pairs.push(emoji.charCodeAt(i));
      }
    }

    code = pairs.map((x) => x.toString(16).padStart(4, '0')).join('-');
  }

  return code;
}