import { Component } from '../router';

export type VNode = string | number | VDOM | null | undefined;
export type VDOM = {
  type: string;
  props: Record<string, any> | null;
  children: VNode[];
};

export const h = (
  component: string | Component,
  props: Record<string, any> | null,
  ...children: VNode[]
) => {
  if (typeof component === 'function') {
    return component({ ...props, children });
  }
  return {
    type: component,
    props,
    children: children.flat(),
  };
};
