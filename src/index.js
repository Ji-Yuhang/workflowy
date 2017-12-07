import dva from 'dva';
// import './index.css';
import {setAuthenticationToken} from './utils/authentication'
import {setConfiguration} from './utils/configuration'
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});
setAuthenticationToken('cjETVWtfzWey_KpSyYMs')
setConfiguration('API_ROOT', '');

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
