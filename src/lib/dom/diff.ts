import { VNode } from '@/lib/jsx/jsx-runtime';
import { createElement } from './client';

const diffTextVDOM = (newVDOM: VNode, currentVDOM: VNode) => {
  if (typeof newVDOM === 'number' && typeof currentVDOM === 'string')
    return true;
  if (typeof newVDOM === 'string' && typeof currentVDOM === 'number')
    return true;
  if (typeof newVDOM === 'number' && typeof currentVDOM === 'number')
    return true;
  if (typeof newVDOM === 'string' && typeof currentVDOM === 'string') {
    return true;
  }
  if (newVDOM === currentVDOM) return false;

  return false;
};

function updateAttributes(
  target: Element,
  newProps: Record<string, any>,
  oldProps: Record<string, any>
) {
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    (target as any)[attr] = value;
  }

  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    if (attr.startsWith('on')) {
      (target as any)[attr] = null;
    } else if (attr.startsWith('class')) {
      target.removeAttribute('class');
    } else {
      target.removeAttribute(attr);
    }
  }
}

const updateElement = (
  parent: Element,
  newVDOM?: VNode | null,
  currentVDOM?: VNode | null,
  index: number = 0
) => {
  let removeIndex: undefined | number = undefined;

  const hasOnlyCurrentVDOM =
    newVDOM === null ||
    (newVDOM === undefined &&
      currentVDOM !== null &&
      currentVDOM !== undefined);

  const hasOnlyNewVDOM =
    newVDOM !== null &&
    newVDOM !== undefined &&
    (currentVDOM === null || currentVDOM === undefined);

  console.log(currentVDOM);

  //1.
  if (parent.childNodes) {
    if (hasOnlyCurrentVDOM) {
      parent.removeChild(parent.childNodes[index]);
      return index;
    }
  }

  //2.
  if (hasOnlyNewVDOM) {
    parent.appendChild(createElement(newVDOM));
    return;
  }

  //3.
  if (diffTextVDOM(newVDOM, currentVDOM)) {
    parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    return;
  }

  if (typeof newVDOM === 'number' || typeof newVDOM === 'string') return;
  if (typeof currentVDOM === 'number' || typeof currentVDOM === 'string')
    return;
  if (!newVDOM || !currentVDOM) return;

  //4.
  if (newVDOM.type !== currentVDOM.type) {
    parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    return;
  }

  //5.
  updateAttributes(
    parent.childNodes[index] as Element,
    newVDOM.props ?? {},
    currentVDOM.props ?? {}
  );

  //6.
  const maxLength = Math.max(
    newVDOM.children.length,
    currentVDOM.children.length
  );
  for (let i = 0; i < maxLength; i++) {
    const _removeIndex = updateElement(
      parent.childNodes[index] as Element,
      newVDOM.children[i],
      currentVDOM.children[i],
      removeIndex ?? i
    );
    removeIndex = _removeIndex;
  }
};

export { updateElement };
