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

/**
 * Definition for svg ids yaml to be used in typescript
 */
declare module "ids.yml" {
  const value: {
    alu: string;
    cu: string;
    be: string;
    ignore: string[];
    areaID: string;
    areaBorderID: string;
    focusID: string;
    stageBoxID: string;
    backgroundID: string;
    signalID: string;
    wireID: string;
    moduleID: string;
    portID: string;
    muxGroupID: string;
  };
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}
