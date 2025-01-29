import { VDOM } from '@/lib/jsx/jsx-runtime';
import { Component } from '../router';
import { updateElement } from './diff';
import { shallowEqual } from './utils/object';

interface IRenderInfo {
  $root: HTMLElement | null;
  component: null | Component;
  currentVDOM: VDOM | null;
}

interface IOptions {
  states: any[];
  stateHook: number;
}

const frameRunner = (callback: () => void) => {
  let requestId: ReturnType<typeof requestAnimationFrame>;
  return () => {
    requestId && cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(callback);
  };
};

const domRenderer = () => {
  const options: IOptions = {
    states: [],
    stateHook: 0,
  };

  const renderInfo: IRenderInfo = {
    $root: null,
    component: null,
    currentVDOM: null,
  };

  const resetOptions = () => {
    options.states = [];
    options.stateHook = 0;
  };

  const _render = frameRunner(() => {
    const { $root, currentVDOM, component } = renderInfo;
    if (!$root || !component) return;

    const newVDOM = component();
    updateElement($root, newVDOM, currentVDOM);
    renderInfo.currentVDOM = newVDOM;
    options.stateHook = 0; // stateHook을 0으로 초기화
  });

  const render = (root: HTMLElement, component: Component) => {
    resetOptions(); // options를 전부 리셋
    renderInfo.$root = root;
    renderInfo.component = component;
    _render();
  };

  const useState = <T>(initialState?: T) => {
    const { stateHook: index, states } = options;
    const state = (states[index] ?? initialState) as T;
    const setState = (newState: T) => {
      if (shallowEqual(state, newState)) return;
      states[index] = newState;
      _render();
    };
    options.stateHook += 1;
    return [state, setState] as const;
  };

  return { useState, render };
};

export const { render, useState } = domRenderer();
