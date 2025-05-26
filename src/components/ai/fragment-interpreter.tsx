import { ExecutionResultInterpreter } from './types'
import Image from 'next/image'

export function FragmentInterpreter({
  result,
}: {
  result: ExecutionResultInterpreter
}) {
  if (!result) return null

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-auto">
        {/* Cell Results */}
        {result.cellResults &&
          result.cellResults.map((cellResult, index) => (
            <div key={index} className="border-b last:border-b-0">
              {cellResult.type === 'image/png' && cellResult.png && (
                <div className="p-4">
                  <Image
                    src={`data:image/png;base64,${cellResult.png}`}
                    alt={`Output ${index}`}
                    width={600}
                    height={400}
                    className="max-w-full h-auto"
                  />
                </div>
              )}
              {cellResult.type === 'text/plain' && cellResult.text && (
                <div className="p-4">
                  <pre className="text-sm whitespace-pre-wrap">
                    {cellResult.text}
                  </pre>
                </div>
              )}
              {cellResult.value && typeof cellResult.value === 'string' && (
                <div className="p-4">
                  <pre className="text-sm whitespace-pre-wrap">
                    {cellResult.value}
                  </pre>
                </div>
              )}
            </div>
          ))}

        {/* Runtime Error */}
        {result.runtimeError && (
          <div className="p-4 border-b">
            <div className="text-red-500 font-semibold">
              {result.runtimeError.name}: {result.runtimeError.value}
            </div>
            <pre className="text-red-400 text-xs mt-2 whitespace-pre-wrap">
              {result.runtimeError.traceback}
            </pre>
          </div>
        )}

        {/* Logs Output */}
        {(result.stdout?.length || result.stderr?.length) && (
          <LogsOutput
            stdout={Array.isArray(result.stdout) ? result.stdout : []}
            stderr={Array.isArray(result.stderr) ? result.stderr : []}
          />
        )}
      </div>
    </div>
  )
}

function LogsOutput({
  stdout,
  stderr,
}: {
  stdout: string[]
  stderr: string[]
}) {
  return (
    <div className="w-full h-32 max-h-32 overflow-y-auto flex flex-col items-start justify-start space-y-1 p-4">
      {stdout.map((out: string, index: number) => (
        <pre key={`stdout-${index}`} className="text-xs">
          {out}
        </pre>
      ))}
      {stderr.map((err: string, index: number) => (
        <pre key={`stderr-${index}`} className="text-xs text-red-500">
          {err}
        </pre>
      ))}
    </div>
  )
} 