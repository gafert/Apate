/* SystemJS module definition */
declare let nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  objdumpWorker: Worker;
  process: any;
  require: any;
}

declare module "*.frag" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}

declare module "*.txt" {
  const value: string;
  export default value;
}

declare module "*.yaml" {
  const value: any;
  export default value;
}

declare module "*.yml" {
  const value: any;
  export default value;
}
