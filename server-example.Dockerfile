FROM node:lts-hydrogen

LABEL org.opencontainers.image.source=https://github.com/ProjectDrinX/BeamIO

WORKDIR /app

RUN yarn global add ts-node typescript

COPY . .

RUN yarn
RUN cd examples/server && yarn
RUN cd examples/BeamSchemes && yarn

EXPOSE 8310

CMD ["ts-node", "examples/server/main.ts"]
