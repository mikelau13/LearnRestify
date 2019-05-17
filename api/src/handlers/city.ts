import { Next, Request, Response } from 'restify';
import DummyDataService from '../services/dummyDataService';
import { NotFoundError } from 'restify-errors';

export const getCity = (req: Request, res:Response, next: Next) => {
    const { slug }: { slug: string } = req.params;
    console.log('slug', slug);
    const searchResult = DummyDataService.getDummyDataByCity(slug);

    if (searchResult) {
        res.send(searchResult);
        return next();
    } else {
        return next(
            new NotFoundError('Not Found')
          );
    }
}