// Custom type declarations to satisfy missing modules from third-party packages
// especially those imported by dependencies but not used directly in our code.

// PrimeUI utils submodules imported by @primeuix/styled
declare module '@primeuix/utils/eventbus';
declare module '@primeuix/utils/classnames';
declare module '@primeuix/utils/dom';
declare module '@primeuix/utils/mergeprops';
declare module '@primeuix/utils/object';
declare module '@primeuix/utils/uuid';
declare module '@primeuix/utils/zindex';

// Kendo peer modules that are referenced by kendo packages but not installed
// We treat them as any so that the compiler doesn't complain during build.
declare module '@progress/kendo-angular-buttons';
declare module '@progress/kendo-angular-layout';
declare module '@progress/kendo-angular-upload';
declare module '@progress/kendo-angular-menu';
declare module '@progress/kendo-licensing';
