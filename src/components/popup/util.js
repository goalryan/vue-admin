let zIndex = 999;

export const getIndex = () => {
  zIndex += 1;
  return zIndex;
};
export const getDom = (dom) => {
  if (dom.nodeType === 3) {
    const newDom = dom.nextElementSibling || dom.nextSibling;
    getDom(newDom);
  }
  return dom;
};
