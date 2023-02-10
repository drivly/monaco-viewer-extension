import { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'

const useViewportWidth = () => {
  const [width, setWidth] = useState<number | null>(null)
  useEffect(() => {
    if (width === null) setWidth(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width ?? 0
}

export function formatJSON(val: any = {}) {
  try {
    const res = JSON.parse(val)
    return JSON.stringify(res, null, 2)
  } catch {
    const errorJson = {
      error: `非法返回${val}`,
    }
    return JSON.stringify(errorJson, null, 2)
  }
}

const isJSON = (str: any) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
function App() {
  const [data, setData] = useState<string | null>(null)
  const [theme, setTheme] = useState(0)
  const editorTheme = ['vs-dark', 'hc-black', 'vs']
  const [language, setLanguage] = useState('json')
  const width = useViewportWidth()

  const editorDidMount = (editor: any, monaco: any) => {
    setTimeout(function () {
      editor.getAction('editor.action.formatDocument').run()
    }, 300)

    editor.focus()
  }

  useEffect(() => {
    const elems = document.body.getElementsByTagName('*')
    const filteredElems = Array.from(elems).filter(
      (elem: Element) => elem.id !== 'extension-root'
    ).length
    const preElemCount = document.querySelectorAll('pre').length

    if (filteredElems === preElemCount) {
      const text = document.querySelector('pre')?.textContent
      if (isJSON(text)) {
        setData(JSON.parse(JSON.stringify(text!, undefined, 2)))
      }
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'json' ? 'javascript' : 'json')
  }
  return (
    <>
      {data ? (
        <>
          <div className='flex justify-end items-center py-2 bg-[#1E1E1E] space-x-4 px-5'>
            <p className='uppercase font-medium text-[#9CDCFD] text-sm'>{editorTheme[theme]}</p>
            <button
              className='uppercase font-medium text-gray-200 text-sm'
              onClick={() => setTheme(theme + 1 > 2 ? 0 : theme + 1)}>
              Change Theme
            </button>
            <p className='uppercase font-medium text-[#9CDCFD] text-sm'>
              {language === 'json' ? 'json' : 'javascipt'}
            </p>
            <button
              className='uppercase font-medium text-gray-200 text-sm'
              onClick={toggleLanguage}>
              Select Language
            </button>
          </div>

          <MonacoEditor
            height={window.innerHeight}
            width={width}
            language={language}
            value={formatJSON(data)}
            editorDidMount={editorDidMount}
            theme={editorTheme[theme]}
            options={{
              readOnly: true,
              fontFamily: 'Consolas',
              fontSize: 15,
              wordWrap: 'on',
              wordWrapColumn: 120,
              wrappingIndent: 'indent',
              links: true,
              padding: {
                top: 16,
              },
              minimap: {
                enabled: width > 768,
              },
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default App
