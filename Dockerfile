FROM nodesource/node:latest

ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 8765

CMD ["node","app.js"]
