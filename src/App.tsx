import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Code2, Eye, Layout, Github, MonitorSmartphone, Save, Share2, Download, Sparkles as FileSparkles, Trash2 } from 'lucide-react';

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

// Function to format code based on language
const formatCode = (code: string, language: string): string => {
  if (!code || typeof code !== 'string') {
    return code;
  }

  try {
    if (language === 'html') {
      return formatHTML(code);
    } else if (language === 'css') {
      return formatCSS(code);
    } else if (language === 'javascript') {
      return formatJavaScript(code);
    }
    return code;
  } catch (error) {
    console.warn('Formatting failed, returning original code:', error);
    return code;
  }
};

const formatHTML = (code: string): string => {
  let indent = 0;
  const tab = '  ';
  
  return code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      let result = line;
      
      // Decrease indent for closing tags
      if (line.match(/<\/[^>]+>/)) {
        indent--;
      }
      
      // Add current indentation
      result = tab.repeat(Math.max(0, indent)) + result;
      
      // Increase indent for opening tags that aren't self-closing
      if (line.match(/<[^/][^>]*>/) && !line.match(/<[^/][^>]*\/>/)) {
        indent++;
      }
      
      return result;
    })
    .join('\n');
};

const formatCSS = (code: string): string => {
  return code
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/\s*;\s*/g, ';\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      if (line.includes('{')) {
        return line;
      }
      if (line === '}') {
        return line;
      }
      return '  ' + line;
    })
    .join('\n');
};

const formatJavaScript = (code: string): string => {
  let indent = 0;
  const tab = '  ';
  
  return code
    .replace(/([{;}])/g, '$1\n')
    .replace(/,\s*/g, ', ')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      let result = line;
      
      // Decrease indent for closing braces
      if (line.includes('}')) {
        indent--;
      }
      
      // Add current indentation
      result = tab.repeat(Math.max(0, indent)) + result;
      
      // Increase indent for opening braces
      if (line.includes('{')) {
        indent++;
      }
      
      return result;
    })
    .join('\n');
};

// Function to save code to localStorage
const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

// Function to load code from localStorage
const loadFromStorage = (key: string, defaultValue: string) => {
  try {
    const saved = localStorage.getItem(key);
    return saved || defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

function App() {
  const [html_code, setHTML] = useState(() => loadFromStorage('html_code', defaultHTML));
  const [css_code, setCSS] = useState(() => loadFromStorage('css_code', defaultCSS));
  const [js_code, setJS] = useState(() => loadFromStorage('js_code', defaultJS));
  const [activeTab, setActiveTab] = useState('html');
  const [isVerticalLayout, setIsVerticalLayout] = useState(window.innerWidth < 768);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Save code changes to localStorage
  useEffect(() => {
    saveToStorage('html_code', html_code);
    saveToStorage('css_code', css_code);
    saveToStorage('js_code', js_code);
  }, [html_code, css_code, js_code]);

  useEffect(() => {
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

  const handleFormat = () => {
    try {
      switch (activeTab) {
        case 'html':
          setHTML(formatCode(html_code, 'html'));
          break;
        case 'css':
          setCSS(formatCode(css_code, 'css'));
          break;
        case 'javascript':
          setJS(formatCode(js_code, 'javascript'));
          break;
      }
    } catch (error) {
      console.warn('Format operation failed:', error);
    }
  };

  const handleEraseAll = () => {
    if (window.confirm('Are you sure you want to erase all code in the current editor?')) {
      switch (activeTab) {
        case 'html':
          setHTML('');
          break;
        case 'css':
          setCSS('');
          break;
        case 'javascript':
          setJS('');
          break;
      }
    }
  };

  const handleShare = async () => {
    try {
      const codeToShare = {
        html: html_code,
        css: css_code,
        javascript: js_code
      };
      
      const blob = new Blob([JSON.stringify(codeToShare)], { type: 'application/json' });
      const data = {
        files: [
          new File([blob], 'code.json', { type: 'application/json' })
        ],
        title: 'Live Code Editor - Code Share',
        text: 'Check out my code from Live Code Editor!'
      };
      
      if (navigator.share && navigator.canShare(data)) {
        await navigator.share(data);
      } else {
        // Fallback for browsers that don't support sharing
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing code:', error);
    }
  };

  const handleDownload = () => {
    const codeToDownload = {
      html: html_code,
      css: css_code,
      javascript: js_code
    };
    
    const blob = new Blob([JSON.stringify(codeToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col`}>
      <div className="container mx-auto p-4 flex-grow">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Live Code Editor</h1>
              <p className="text-sm text-gray-400">by Vishalraja</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFormat}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Format Code"
            >
              <FileSparkles className="w-5 h-5" />
            </button>
            <button
              onClick={handleEraseAll}
              className="p-2 rounded bg-red-700 hover:bg-red-600"
              title="Erase All"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Toggle Theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Share Code"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Download Code"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsVerticalLayout(!isVerticalLayout)}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Toggle Layout"
            >
              <MonitorSmartphone className="w-5 h-5" />
            </button>
            <a
              href="https://github.com/vishalrajal"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className={`grid ${isVerticalLayout ? 'grid-cols-1' : 'grid-cols-2'} gap-4 h-[calc(100vh-12rem)]`}>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-2 overflow-x-auto`}>
              <Code2 className="w-5 h-5 flex-shrink-0" />
              <div className="flex gap-1">
                {['html', 'css', 'javascript'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
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
              theme={isDarkMode ? oneDark : undefined}
              extensions={[getLanguageExtension(activeTab)]}
              onChange={handleCodeChange}
              className="h-full"
            />
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-2`}>
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
      
      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} text-center py-4 mt-4`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Developed by Vishalraja
        </p>
      </footer>
    </div>
  );
}

export default App;