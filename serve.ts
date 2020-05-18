import { serve } from "https://deno.land/std@0.50.0/http/server.ts";

console.log("Reading ads.list file");
const decoder = new TextDecoder("utf-8");
const ads = decoder.decode(await Deno.readFile("ads.list")).split("\n");

let respondedUids: string[] = [];

const s = serve({ port: 8000 });
console.log("Http server started");
console.log("http://localhost:8000/");

const bad_request = { body: "Error 400 bad request.", status: 400 };

for await (const req of s) {
  let params = req.url.split("?");
  if (params.length != 2) {
    req.respond(bad_request);
    continue;
  }
  params = params[1].split("=");

  let uid: string | null = null;
  params.forEach((element, index) => {
    if (element === "uid") {
      uid = params[index + 1];
    }
  });

  if (uid === null) {
    req.respond(bad_request);
    continue;
  }

  if (respondedUids.includes(uid)) {
    req.respond(bad_request);
    continue;
  }

  respondedUids.push(uid);

  setTimeout(() => {
    respondedUids = respondedUids.filter((obj) => obj !== uid);
  }, 30000);

  const randomElement = ads[Math.floor(Math.random() * ads.length)];
  req.respond({ body: randomElement });
}
