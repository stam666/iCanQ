import amqp, { ConsumeMessage } from "amqplib";
import { SocketsService } from "./socket.service";
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

const assertAndConsumeQueue = async (
  queue: Queue,
  onOrderConsumed: (order: IOrder) => void
) => {
  await orderChannel.assertQueue(queue, { durable: false });
  await orderChannel.bindQueue(queue, EXCHANGE, queue);
  console.log(`AMQP - consume queue: ${queue}`);
  orderChannel.prefetch(1);
  orderChannel.consume(queue, (msg: ConsumeMessage) => {
    console.log(`AMQP - consume order: ${msg.content.toString()}`);
    const order: IOrder = JSON.parse(msg.content.toString());
    onOrderConsumed(order);
    orderChannel.ack(msg);
  });
};

export const MqService = {
  amqpConnect: amqpConnect,
  assertAndConsumeQueue: assertAndConsumeQueue,
};
