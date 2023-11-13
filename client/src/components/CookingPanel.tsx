import { Button } from "@mui/material";
import { IOrder, OrderStatus } from "@/models/order.model";
import { orderService } from "@/libs/orderService";

const CookingPanel: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
  const handleCompleteOrder = (orderId: string) => {
    orderService.updateOrder(orderId, OrderStatus.Completed);
    console.log(`Complete order with ID: ${orderId}`);
  };

  return (
    <div className="w-full space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="text-white-dark-active">
          <div className="flex flex-row justify-between rounded-2xl bg-white shadow-lg w-full">
            <div className="flex flex-col p-4 space-y-4">
              <div className="break-all">Order: {order._id}</div>
              {order.orderItems?.map((item) => (
                <div key={item.menuId} className="flex flex-col">
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

            <Button
              className="bg-primary p-8 text-white justify-center items-center text-center rounded-tr-2xl rounded-br-2xl flex flex-col space-y-2 hover:bg-brown-dark-hover transition-all duration-30"
              onClick={() => order._id && handleCompleteOrder(order._id)}
            >
              <div>Complete</div>
              <p className="text-2xl">{order.totalPrice}฿</p>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CookingPanel;
