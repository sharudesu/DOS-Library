FROM alpine:latest
RUN apk add --no-cache nodejs npm


WORKDIR /app


COPY . /app


RUN npm install


EXPOSE 3003


ENTRYPOINT ["node"]

CMD ["order.js"]
