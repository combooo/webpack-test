async function start() {
    return await Promise.resolve('async is working');
}

const unused = 42;

start().then(console.log);

class Util {
    static id = Date.now()
}

console.log('Util Id: ', Util.id);
console.log(unused);