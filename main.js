import http from "node:http";
import urlParser from "node:url"
import { shorten } from "./shortener.js"
import { getOriginalLink } from "./services.js";

const API = "http://localhost:3000/"

function getPathName(url) {
  const parsedUrl = urlParser.parse(url, true);

  return parsedUrl.pathname;
}

const server = http.createServer((req, res) => {
  if (req.method != "POST" && req.method != "GET") {
    res.writeHead(405, { "content-type": "text/plain" });
    return res.end("Method Type Not Allowed");
  }

  if (req.method == "GET") {
    const url = getPathName(req.url).slice(1);

    const originalURL = getOriginalLink(url);
    if (originalURL == null) {
      res.writeHead(400, { "content-type": "text/plain" });
      return res.end("Wrong URL");
    }


    res.writeHead(302, { 'Location': `${originalURL}` });
    return res.end();
  }

  if (req.method == "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    }).on('end', () => {
      try {
        body = JSON.parse(body);
      }
      catch (eror) {
        res.writeHead(400, { 'content-type': 'text/plain' });
        return res.end('Wrong JSON Payload');
      }

      if (body == '') {
        res.writeHead(400, { "content-type": "text/plain" });
        return res.end("URL field must not be empty");
      }

      const newUrl = shorten(body.url);

      res.writeHead(200, { "content-type": "text/plain" });
      return res.end(`${API}${newUrl}`);
    })
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
