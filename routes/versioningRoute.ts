export default function sendV1(req, res, next) {
    res.send('hello: ' + req.params.name);
    return next();
}
  
export function sendV2(req, res, next) {
    res.send({ hello: req.params.name });
    return next();
}

export function sendV3(req, res, next) {
    return 'testing';
};