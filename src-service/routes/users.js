export function list(req, res) {
    let {sort} = req.query;
    sort = sort ? sort.toLowerCase() : 'desc';
    if (!(sort === 'asc' || sort === 'desc')) {
        return res.status(400).send('Invalid sort params');
    }
    res.json([]);
}

export function create(req, res) {
    const {title, body} = req.body;
    res.json({title, body});
}

export function read(req, res) {
    const id = req.params;
    res.send(`read ${id}`);
    res.send({sample: 'OKA'});
}

export function update(req, res) {
    const id = req.params;
    res.send(`updated ${id}`);
}

export function remove(req, res) {
    const id = req.params;
    res.send(`removed ${id}`);
    res.send('deleted');
}