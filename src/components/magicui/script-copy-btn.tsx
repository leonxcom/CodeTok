'use client'

import { shadcn } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { HTMLAttributes, useEffect, useState } from 'react'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

interface ScriptCopyBtnProps extends HTMLAttributes<HTMLDivElement> {
  showMultiplePackageOptions?: boolean
  codeLanguage: string
  lightTheme: string
  darkTheme: string
  commandMap: Record<string, string>
  className?: string
}

export function ScriptCopyBtn({
  showMultiplePackageOptions = true,
  codeLanguage,
  lightTheme,
  darkTheme,
  commandMap,
  className,
}: ScriptCopyBtnProps) {
  const { resolvedTheme } = useTheme()
  const installers = Object.keys(commandMap)
  const [active, setActive] = useState<string>(installers[0])
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState<string>('')

  useEffect(() => {
    loadHighlightedCode().catch(console.error)

    async function loadHighlightedCode() {
      const shiki = await import('shiki')
      const highlighter = await shiki.createHighlighter({
        themes: [lightTheme, darkTheme],
        langs: [codeLanguage],
      })

      const light = highlighter.codeToHtml(commandMap[active], {
        lang: codeLanguage,
        theme: lightTheme,
      })
      const dark = highlighter.codeToHtml(commandMap[active], {
        lang: codeLanguage,
        theme: darkTheme,
      })

      setHighlightedCode(
        light
          .replace(
            '<pre class=',
            '<pre class="dark:hidden w-full h-full overflow-auto break-words [text-wrap:balance]" ',
          )
          .concat(
            dark.replace(
              '<pre class=',
              '<pre class="hidden dark:block w-full h-full overflow-auto break-words [text-wrap:balance]" ',
            ),
          ),
      )
    }
  }, [active, commandMap, codeLanguage, lightTheme, darkTheme])

  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(commandMap[active])
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-lg border bg-background p-2 flex flex-col items-center justify-start overflow-hidden text-background-foreground relative w-full',
        className,
      )}
    >
      <div
        className={cn(
          'max-w-full overflow-x-auto mb-2',
          showMultiplePackageOptions ? 'w-full' : 'hidden',
        )}
      >
        <div className="flex items-center flex-nowrap gap-2">
          {showMultiplePackageOptions &&
            installers.map((installer) => (
              <shadcn.Button.Button
                key={installer}
                onClick={() => setActive(installer)}
                variant={active === installer ? 'default' : 'outline'}
                className="px-2 py-1"
              >
                {installer}
              </shadcn.Button.Button>
            ))}
        </div>
      </div>
      <div className="flex w-full flex-col-reverse lg:flex-row items-center lg:items-stretch gap-2">
        <div
          className="w-full text-sm min-h-[7.5rem] max-h-[14rem] relative"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <shadcn.Button.Button
          size={'icon'}
          variant="ghost"
          onClick={copyToClipboard}
          className="self-end group"
        >
          <AnimatedCopyButton
            copied={copied}
            className="p-2 h-8 w-8 transition-all"
          />
        </shadcn.Button.Button>
      </div>
    </div>
  )
}

function AnimatedCopyButton({
  copied,
  className,
}: {
  copied: boolean
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: copied ? 0 : 1 }}
        className="absolute inset-0 transform-gpu"
      >
        <CopyIcon className="size-full" />
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: copied ? 1 : 0 }}
        className="absolute inset-0 transform-gpu text-green-500 dark:text-green-400"
      >
        <CheckIcon className="size-full" />
      </motion.div>
    </div>
  )
}
