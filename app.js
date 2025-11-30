class CodeCoreSandbox {
    constructor() {
        this.editor = document.getElementById('codeEditor');
        this.preview = document.getElementById('previewFrame');
        this.runBtn = document.getElementById('runBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.frameworkSelect = document.getElementById('framework');
        this.status = document.getElementById('status');
        this.divider = document.getElementById('divider');
        this.toggleFull = document.getElementById('toggleFull');
        
        this.isFullscreen = false;
        this.dividerPos = 50;
        
        this.init();
    }
    
    init() {
        this.loadCode();
        this.bindEvents();
        this.updateStatus('Ready');
        this.runCode(); // Initial run
    }
    
    bindEvents() {
        // Run button
        this.runBtn.onclick = () => this.runCode();
        
        // Clear
        this.clearBtn.onclick = () => {
            if (confirm('Clear editor?')) {
                this.editor.value = '';
                this.runCode();
            }
        };
        
        // Save/Load
        this.saveBtn.onclick = () => {
            localStorage.setItem('codecore_code', this.editor.value);
            localStorage.setItem('codecore_framework', this.frameworkSelect.value);
            this.updateStatus('Saved');
        };
        
        this.loadBtn.onclick = () => {
            this.loadCode();
            this.runCode();
        };
        
        // Framework change
        this.frameworkSelect.onchange = () => this.runCode();
        
        // Editor auto-run (debounced)
        let timeout;
        this.editor.oninput = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.runCode(), 1000);
        };
        
        // Divider resize
        let isResizing = false;
        this.divider.onmousedown = (e) => {
            isResizing = true;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        };
        
        document.onmousemove = (e) => {
            if (!isResizing) return;
            const rect = document.querySelector('.split-container').getBoundingClientRect();
            this.dividerPos = ((e.clientX - rect.left) / rect.width) * 100;
            this.updateLayout();
        };
        
        document.onmouseup = () => {
            isResizing = false;
            document.body.style.userSelect = '';
        };
        
        // Fullscreen toggle
        this.toggleFull.onclick = () => {
            this.isFullscreen = !this.isFullscreen;
            this.preview.classList.toggle('fullscreen', this.isFullscreen);
            this.toggleFull.textContent = this.isFullscreen ? '❐' : '⛶';
        };
    }
    
    detectFramework(code) {
        const threejsRegex = /(?:THREE\.|new\s+THREE\.|import\s+\*?\s+as\s+THREE|from\s+['"]three)/i;
        if (threejsRegex.test(code)) return 'threejs';
        return 'vanilla';
    }
    
    generateBoilerplate(framework) {
        const threeCDN = 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.min.js';
        
        switch (framework) {
            case 'threejs':
                return `
<!DOCTYPE html>
<html>
<head>
    <script src="${threeCDN}"></script>
    <style>
        body { margin: 0; overflow: hidden; background: #000; font-family: Arial; }
        #error { 
            position: fixed; top: 10px; left: 10px; 
            background: rgba(255,0,0,0.9); color: white; 
            padding: 10px; border-radius: 4px; 
            max-width: 80%; max-height: 80%; overflow: auto;
            z-index: 9999; font-family: monospace;
        }
        #console { 
            position: fixed; bottom: 10px; left: 10px; 
            background: rgba(0,0,0,0.9); color: #0f0; 
            padding: 10px; border-radius: 4px; 
            max-width: 80%; max-height: 40%; overflow: auto;
            font-family: monospace; font-size: 12px;
        }
    </style>
</head>
<body>
    <div id="error" style="display:none;"></div>
    <div id="console"></div>
    <script>
        window.onerror = function(msg, url, line, col, error) {
            const errorDiv = document.getElementById('error');
            errorDiv.innerHTML = '<strong>Runtime Error:</strong><br>' + 
                msg + '<br>Line: ' + line + ', Col: ' + col + 
                '<br><br><pre>' + (error ? error.stack : '') + '</pre>';
            errorDiv.style.display = 'block';
            return true;
        };
        
        const originalConsole = console.log;
        console.log = (...args) => {
            const consoleDiv = document.getElementById('console');
            consoleDiv.innerHTML += args.join(' ') + '<br>';
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
            originalConsole.apply(console, args);
        };
        
        console.error = (...args) => {
            const errorDiv = document.getElementById('error');
            errorDiv.innerHTML += '<strong>Console Error:</strong><br>' + args.join(' ') + '<br><br>';
            errorDiv.style.display = 'block';
            document.getElementById('console').innerHTML += '<span style="color:red">' + args.join(' ') + '</span><br>';
        };
        
        console.warn = console.error;
        
        try {
`;
            
            case 'vanilla':
            default:
                return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background: #f0f0f0; font-family: Arial; }
        #error { 
            position: fixed; top: 10px; left: 10px; 
            background: rgba(255,0,0,0.9); color: white; 
            padding: 10px; border-radius: 4px; 
            max-width: 80%; max-height: 80%; overflow: auto;
            z-index: 9999; font-family: monospace;
        }
        #console { 
            position: fixed; bottom: 10px; left: 10px; 
            background: rgba(0,0,0,0.9); color: #0f0; 
            padding: 10px; border-radius: 4px; 
            max-width: 80%; max-height: 40%; overflow: auto;
            font-family: monospace; font-size: 12px;
        }
    </style>
</head>
<body>
    <div id="error" style="display:none;"></div>
    <div id="console"></div>
    <script>
        window.onerror = function(msg, url, line, col, error) {
            document.getElementById('error').innerHTML = 
                '<strong>Runtime Error:</strong><br>' + msg + 
                '<br>Line: ' + line + ', Col: ' + col +
                '<br><br><pre>' + (error ? error.stack : '') + '</pre>';
            document.getElementById('error').style.display = 'block';
            return true;
        };
        
        const originalConsole = console.log;
        console.log = (...args) => {
            const consoleDiv = document.getElementById('console');
            consoleDiv.innerHTML += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '<br>';
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
            originalConsole.apply(console, args);
        };
        
        console.error = console.warn = (...args) => {
            const errorDiv = document.getElementById('error');
            errorDiv.innerHTML += '<strong>Console Error:</strong><br>' + 
                args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '<br><br>';
            errorDiv.style.display = 'block';
        };
        
        try {
`;
        }
    }
    
    generateHTML(code) {
        const framework = this.frameworkSelect.value === 'auto' ? 
            this.detectFramework(code) : this.frameworkSelect.value;
        
        const boilerplate = this.generateBoilerplate(framework);
        const closeCode = `
        } catch(e) {
            document.getElementById('error').innerHTML = 
                '<strong>Code Error:</strong><br>' + e.message + 
                '<br><br><pre>' + e.stack + '</pre>';
            document.getElementById('error').style.display = 'block';
            throw e;
        }
        </script>
</body>
</html>`;
        
        return boilerplate + code + closeCode;
    }
    
    runCode() {
        try {
            const code = this.editor.value;
            const html = this.generateHTML(code);
            this.preview.srcdoc = html;
            this.updateStatus('Running...');
        } catch(e) {
            this.updateStatus('Error: ' + e.message);
            console.error(e);
        }
    }
    
    updateLayout() {
        document.querySelector('.left-pane').style.width = this.dividerPos + '%';
        document.querySelector('.right-pane').style.width = (100 - this.dividerPos) + '%';
        document.querySelector('.divider').style.left = this.dividerPos + '%';
    }
    
    updateStatus(msg) {
        this.status.textContent = msg;
        setTimeout(() => {
            if (this.status.textContent === msg) {
                this.status.textContent = 'Ready';
            }
        }, 2000);
    }
    
    loadCode() {
        const saved = localStorage.getItem('codecore_code');
        if (saved) {
            this.editor.value = saved;
            const savedFramework = localStorage.getItem('codecore_framework') || 'auto';
            this.frameworkSelect.value = savedFramework;
        }
    }
}

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    new CodeCoreSandbox();
});

// Service Worker for offline (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}
