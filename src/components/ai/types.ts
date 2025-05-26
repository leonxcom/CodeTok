export interface ExecutionResult {
  sbxId: string;
  template: string;
  url?: string;
  stdout?: string | string[];
  stderr?: string | string[];
  runtimeError?: any;
  cellResults?: any[];
}

export interface ExecutionResultWeb extends ExecutionResult {
  url: string;
}

export interface ExecutionResultInterpreter extends ExecutionResult {
  cellResults: Array<{
    type: string;
    value?: any;
    png?: string;
    text?: string;
  }>;
  stdout: string[];
  stderr: string[];
  runtimeError?: {
    name: string;
    value: string;
    traceback: string;
  };
} 