const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {
        name: "users",
        url: process.env.USER_SERVICE_URL || "http://localhost:4001",
      },
      {
        name: "basket",
        url: process.env.BASKET_SERVICE_URL || "http://localhost:4002",
      },
      {
        name: "product",
        url: process.env.PRODUCT_SERVICE_URL || "http://localhost:4003",
      },
    ],
  }),
});

const start = async () => {
  const port = process.env.PORT || 4000;
  const superGraphName = "gateway";

  const context = ({ req }) => ({ authorization: req.headers.authorization });
  const server = new ApolloServer({ gateway, context, subscriptions: false });

  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port },
    });

    console.log(`🚀 Super graph ${superGraphName} running at ${url}`);
  } catch (err) {
    console.error(err);
  }
};

setTimeout(start, 2000);
