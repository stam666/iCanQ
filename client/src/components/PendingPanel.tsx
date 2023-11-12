
import { CheckCircleOutline, Cancel } from "@mui/icons-material";

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
  createdAt: Date;
}
interface PendingPanelProps {
  orders?: Order[];
}
const PendingPanel: React.FC<PendingPanelProps> = ({ orders = []  }) => {
  const handleAcceptOrder = (orderId: string) => {
    // Add logic for accepting the order
    console.log(`Accepted order with ID: ${orderId}`);
  };

  const handleRejectOrder = (orderId: string) => {
    // Add logic for rejecting the order
    console.log(`Rejected order with ID: ${orderId}`);
  };

  return (
    <div className="w-full space-y-6">
      {orders.map((order) => (
          <div key={order.orderId} className="text-white-dark-active">
            <div className="flex flex-row rounded-2xl bg-white shadow-lg w-full justify-between">
              <div className="flex flex-col p-4 space-y-4">
                <div className="break-all">Order: {order.orderId}</div>
                {order.orderItems.map((item) => (
                  <div key={item.itemId} className="flex flex-col">
                    <div className="flex flex-row space-x-4">
                      <div className="text-primary">x{item.amount}</div>
                      <div>{item.name}</div>
                    </div>
                    {item.note !== "" ? (
                      <div className="text-white-normal-active">
                        {item.note}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end p-4 text-sm justify-between space-y-4">
                <div className="text-end">
                  <div className="text-xl">{order.totalPrice}฿</div>
                  <div>{order.createdAt.toLocaleDateString()}</div>
                  <div style={{ whiteSpace: "nowrap" }}>
                    {order.createdAt.toLocaleTimeString()}
                  </div>
                </div>

                {/* Accept and Reject Buttons */}
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleAcceptOrder(order.orderId)}
                    className="bg-blue text-white rounded-full"
                  >
                    <CheckCircleOutline style={{ fontSize: 32 }} />
                  </button>
                  <button
                    onClick={() => handleRejectOrder(order.orderId)}
                    className="bg-red text-white rounded-full"
                  >
                    <Cancel style={{ fontSize: 32 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
export default PendingPanel;