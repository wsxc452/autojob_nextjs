export enum TaskType {
  Init = "init",
  Start = "start",
  Search = "search",
  Stop = "stop",
  Test = "test",
  Paused = "paused",
}

export const ActionKeys = {
  setIsOpended: "setIsOpended",
  addLog: "addLog",
  clearLog: "clearLog",
};

export type LogBody = {
  message: string;
  type: string;
  id?: number;
  time: string;
};

export type StoreActionBody = {
  type: keyof typeof ActionKeys;
  payload: any;
};
