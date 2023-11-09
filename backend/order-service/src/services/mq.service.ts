import amqp, { ConsumeMessage } from "amqplib";
import { IOrder, Queue } from "../resources/interfaces/order.type";


const MQ_HOST = process.env.MQ_HOST || "localhost";
const MQ_URL = `amqp://${MQ_HOST}:5672`;
const EXCHANGE = "order";

let orderChannel = null;


const amqpConnect = async () => {
  try {
    const connection = await amqp.connect(MQ_URL);
    orderChannel = await connection.createChannel();
    console.log("AMQP - connection established at " + MQ_URL);
    await orderChannel.assertExchange(EXCHANGE, "direct", { durable: false });
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

const publishOrder = async (order: IOrder, queue: Queue) => {
  await orderChannel.publish(EXCHANGE, queue, Buffer.from(JSON.stringify(order)));
  console.log(`AMQP - order: ${order} published to ${EXCHANGE} - ${queue}`);
};

export const MqService = {
  amqpConnect: amqpConnect,
  publishOrder: publishOrder,
};
