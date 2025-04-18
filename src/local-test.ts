//src/local-test.ts
import handler from "./../api/index"; // o handler que você expôs
import http from "http";

const server = http.createServer((req: any, res: any) => {
  handler(req, res);
});

server.listen(3000, () => {
  console.log("Serverless-style API listening at http://localhost:3000");
});


// Para testar, você pode usar o seguinte comando curl:
// npx ts-node .\src\local-test.ts