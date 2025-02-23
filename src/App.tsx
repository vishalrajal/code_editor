import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Code2, Eye, Layout, Github, MonitorSmartphone } from 'lucide-react';

const defaultHTML = `<div class="hello">
  <h1>Hello World!</h1>
  <p>Start editing to see changes in real-time</p>
</div>`;

const defaultCSS = `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.hello {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #2563eb;
}`;

const defaultJS = `// Your JavaScript code here
document.querySelector('h1').addEventListener('click', () => {
  alert('Hello from JavaScript!');
});`;

function App() {
  const [html_code, setHTML] = useState(defaultHTML);
  const [css_code, setCSS] = useState(defaultCSS);
  const [js_code, setJS] = useState(defaultJS);
  const [activeTab, setActiveTab] = useState('html');
  const [isVerticalLayout, setIsVerticalLayout] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsVerticalLayout(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const combinedCode = `
    <html>
      <style>${css_code}</style>
      <body>${html_code}</body>
      <script>${js_code}</script>
    </html>
  `;

  const getLanguageExtension = (tab: string) => {
    switch (tab) {
      case 'html':
        return html();
      case 'css':
        return css();
      case 'javascript':
        return javascript();
      default:
        return html();
    }
  };

  const getCurrentCode = (tab: string) => {
    switch (tab) {
      case 'html':
        return html_code;
      case 'css':
        return css_code;
      case 'javascript':
        return js_code;
      default:
        return html_code;
    }
  };

  const handleCodeChange = (value: string) => {
    switch (activeTab) {
      case 'html':
        setHTML(value);
        break;
      case 'css':
        setCSS(value);
        break;
      case 'javascript':
        setJS(value);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Live Code Editor</h1>
              <p className="text-sm text-gray-400">by Vishalraja</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVerticalLayout(!isVerticalLayout)}
              className="flex items-center gap-2 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
              title="Toggle Layout"
            >
              <MonitorSmartphone className="w-5 h-5" />
              <span className="hidden sm:inline">Toggle Layout</span>
            </button>
            <a
              href="https://github.com/vishalrajal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        <div className={`grid ${isVerticalLayout ? 'grid-cols-1' : 'grid-cols-2'} gap-4 h-[calc(100vh-12rem)]`}>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 bg-gray-700 p-2 overflow-x-auto">
              <Code2 className="w-5 h-5 flex-shrink-0" />
              <div className="flex gap-1">
                {['html', 'css', 'javascript'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <CodeMirror
              value={getCurrentCode(activeTab)}
              height="calc(100% - 41px)"
              theme={oneDark}
              extensions={[getLanguageExtension(activeTab)]}
              onChange={handleCodeChange}
              className="h-full"
            />
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 bg-gray-700 p-2">
              <Eye className="w-5 h-5" />
              <span>Preview</span>
            </div>
            <iframe
              title="preview"
              srcDoc={combinedCode}
              className="w-full h-[calc(100%-41px)] bg-white"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-center py-4 mt-4">
        <p className="text-gray-400">
          Developed by Vishalraja
        </p>
      </footer>
    </div>
  );
}

export default App;