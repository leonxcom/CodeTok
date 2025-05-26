import { TemplateId } from './templates';

type ExecutionResultBase = {
  sbxId: string;
};

export type ExecutionResultInterpreter = ExecutionResultBase & {
  template: 'code-interpreter-v1';
  stdout: string[];
  stderr: string[];
  runtimeError?: any;
  cellResults: any[];
};

export type ExecutionResultWeb = ExecutionResultBase & {
  template: Exclude<TemplateId, 'code-interpreter-v1'>;
  url: string;
};

export type ExecutionResult = ExecutionResultInterpreter | ExecutionResultWeb; 