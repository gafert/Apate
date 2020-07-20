/* SystemJS module definition */
declare var nodeModule: NodeModule;
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
