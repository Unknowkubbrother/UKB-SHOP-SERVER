import express from 'express';

import authentication from './authentication';
import license from './license';
import scripts from './scripts';
import payments from './payments';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    license(router);
    scripts(router);
    payments(router);
    return router;
}