import http from "http";

function fetch(path, body) {
    const isGET = body === undefined;
    return new Promise(resolve => {
        let result = '';
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: isGET ? 'GET' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, async res => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', d => {
                result += d;
            });
            res.on("end", () => {
                resolve(JSON.parse(result));
            })
        });
        if (!isGET) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testRequest() {
    const postResult = await fetch('/users', {a: 'c', name: 'Arif'});
    console.log(postResult);
    const getResult = await fetch('/users?a=c&name=Arif');
    console.log(getResult);
}

testRequest().then();
setInterval(() => {
}, 1000000);