import dotenv from "dotenv"
dotenv.config();

import http from "node:http";
import urlParser from "node:url"
import { shorten } from "./shortener.js"
import { getOriginalLink } from "./services.js";


function getPathName(url) {
  const parsedUrl = urlParser.parse(url, true);

  return parsedUrl.pathname;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method != "POST" && req.method != "GET") {
      res.writeHead(405, { "content-type": "text/plain" });
      return res.end("Method Type Not Allowed");
    }

    if (req.method == "GET") {
      const url = getPathName(req.url).slice(1);

      const originalURL = await getOriginalLink(url);
      if (originalURL == null) {
        res.writeHead(400, { "content-type": "text/plain" });
        return res.end("Not Found");
      }


      res.writeHead(302, { 'Location': `${originalURL}` });
      return res.end();
    }

    if (req.method == "POST") {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      }).on('end', async () => {
        try {
          body = JSON.parse(body);
        }
        catch (error) {
          console.log(error);
          res.writeHead(400, { 'content-type': 'text/plain' });
          return res.end('Wrong JSON Payload');
        }

        if (body.url == '') {
          res.writeHead(400, { "content-type": "text/plain" });
          return res.end("URL field must not be empty");
        }

        if(!URL.canParse(body.url)){
          res.writeHead(400, {"content-type": "text/plain"});
          return res.end("Not a valid url");
        }

        const newUrl = await shorten(body.url);

        res.writeHead(200, { "content-type": "text/plain" });
        return res.end(`${process.env.API}${newUrl}`);
      })
    }
  } catch (error) {
    console.log(error);
    res.writeHead(500, {"content-type": "text/plain"});
    res.end("Something Went Wrong. Try Again Later");
  }
});

server.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:3000');
});
