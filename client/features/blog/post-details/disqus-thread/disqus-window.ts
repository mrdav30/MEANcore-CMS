import { InjectionToken } from '@angular/core';

export class DisqusMockWindow {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public DISQUS: {
    reset: (params: {}) => {}
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public disqus_config: () => void;
}

export const WINDOW = new InjectionToken('window');
export const windowFactoryFunction = () => (window) ? window : DisqusMockWindow;
export const disqusWindowProvider = [
  {
    provide: WINDOW,
    useFactory: windowFactoryFunction
  }
];
