import { useEffect, useState } from "react";

// for test---------------------------------------------
interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  amount: number;
  note: string;
}

interface Order {
  orderId: string;
  orderItems: OrderItem[];
  status: string;
  totalPrice: number;
}
const getorderItems = async (): Promise<Order[]> => {
  return [
    {
      orderId: "654bc6948da1d2dc4037522e",
      orderItems: [
        {
          itemId: "654bc6948da1d2dc4037522e",
          name: "ข้าวมันไก่",
          price: 50,
          amount: 1,
          note: "aaaaaaaaaaaa",
        },
        {
          itemId: "654bc6948da1d2dc40375228",
          name: "ข้าวไก่ฝืด",
          price: 40,
          amount: 1,
          note: "a148464546",
        },
      ],
      status: "pending",
      totalPrice: 90,
    },
    {
      orderId: "654bc6948da1d2dc40375228",
      orderItems: [
        {
          itemId: "654bc6958da1d2dc4037522e",
          name: "ข้าวมันไก่",
          price: 50,
          amount: 1,
          note: "",
        },
      ],
      status: "pending",
      totalPrice: 1190,
    },
  ];
};
// for test---------------------------------------------

export default function PendingPanel() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const orderItems = await getorderItems();
      setOrders(orderItems);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full space-y-6">
      {orders.map((order) => (
        <div key={order.orderId} className="text-white-dark-active">
          <div className="flex flex-row rounded-2xl bg-white shadow-lg w-full">
            <div className="w-full flex flex-col p-4 space-y-4">
              <div className="break-all">Order: {order.orderId}</div>
              {order.orderItems.map((item) => (
                <div key={item.itemId} className="flex flex-col">
                  <div className="flex flex-row space-x-4">
                    <div className="text-left text-primary">x{item.amount}</div>
                    <div className="text-left">{item.name}</div>
                  </div>
                  {item.note !== "" ? (
                    <div className="text-left text-white-normal-active">
                      {item.note}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
