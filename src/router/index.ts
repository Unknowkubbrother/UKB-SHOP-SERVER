import express from 'express';

import authentication from './authentication';
import license from './license';
import scripts from './scripts';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    license(router);
    scripts(router);
    return router;
}