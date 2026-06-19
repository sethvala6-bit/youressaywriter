import { OrderForm } from '@/components/order/order-form';

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Place Your Order</h1>
          <p className="text-gray-600">Fill in the details below and our writers will provide you with a quote</p>
        </div>
        <OrderForm />
      </div>
    </div>
  );
}
