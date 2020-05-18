import { serve } from "https://deno.land/std@0.50.0/http/server.ts";

console.log("Reading ads.list file");
const decoder = new TextDecoder('utf-8');
const ads = decoder.decode(await Deno.readFile('ads.list'));

const s = serve({ port: 8000 });
console.log("Http server started");
console.log("http://localhost:8000/");


for await (const req of s) {
    req.respond({ body: "Hello World\n" });
}