import { Router } from 'express';
import { pageContentController } from '../../controllers';

const pageContentRouter = Router();

pageContentRouter.post('/', pageContentController.create);
pageContentRouter.get('/', pageContentController.getAll);
pageContentRouter.get('/id/:id', pageContentController.getById);
pageContentRouter.get('/:url', pageContentController.getByUrl);
pageContentRouter.put('/:url', pageContentController.update);
pageContentRouter.delete('/:url', pageContentController.delete);

export default pageContentRouter;
