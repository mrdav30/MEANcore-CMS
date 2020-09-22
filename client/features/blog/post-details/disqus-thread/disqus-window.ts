import { InjectionToken } from '@angular/core';

export class DisqusMockWindow {
  public DISQUS: {
    reset: (params: {}) => {}
  };
  public disqus_config: () => void;
}

export const WINDOW = new InjectionToken('window');
export const DisqusWindowProvider = [
  {
    provide: WINDOW,
    useFactory: windowFactoryFunction
  }
];

export function windowFactoryFunction() {
  return (window) ? window : DisqusMockWindow;
}
