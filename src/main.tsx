import 'dreamland/dev';
import { Route, Router } from 'dreamland-router';
import Home from './routes/home';
import NotFound from './routes/not-found';

//base styles
import './index.css';
new Router(
    <Route>
        <Route path="" show={<Home />} />
        <Route path="/website" show={<Home />} />
        <Route path="*" show={<NotFound />} />
    </Route>
).mount(document.getElementById('app')!);
