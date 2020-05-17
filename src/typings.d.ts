/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  GridStack: GridStack;
  objdumpWorker: Worker;
  process: any;
  require: any;
}
