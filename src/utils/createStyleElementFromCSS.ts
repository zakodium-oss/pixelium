export default function createStyleElementFromCSS() {
  const sheet = document.styleSheets[0];

  const styleRules: string[] = [];
  for (let i = 0; i < sheet.cssRules.length; i++) {
    const rule = sheet.cssRules.item(i);
    if (rule === null) continue;
    styleRules.push(rule.cssText);
  }

  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.append(document.createTextNode(styleRules.join(' ')));

  return style;
}
