import { VDOM } from '@/lib/jsx/jsx-runtime';
import { Component } from '../router';
import { updateElement } from './diff';

interface IRenderInfo {
  $root: HTMLElement | null;
  component: null | Component;
  currentVDOM: VDOM | null;
}

const domRenderer = () => {
  const renderInfo: IRenderInfo = {
    $root: null,
    component: null,
    currentVDOM: null,
  };

  const _render = () => {
    const { $root, currentVDOM, component } = renderInfo;
    if (!$root || !component) return;

    const newVDOM = component();
    updateElement($root, newVDOM, currentVDOM);
    renderInfo.currentVDOM = newVDOM;
  };

  const render = (root: HTMLElement, component: Component) => {
    renderInfo.$root = root;
    renderInfo.component = component;
    _render();
  };

  return { render };
};

export const { render } = domRenderer();
