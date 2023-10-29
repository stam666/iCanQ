import { startGateway } from "./src/api/gateway/start";

const start = async () => {
  try {
    const startResponses = await Promise.all([startGateway()]);
    console.log(startResponses);
  } catch (error) {
    console.log(error);
  }
};

start();
