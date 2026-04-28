import React, { useState } from 'react';
import api from '../api';

function Sales() {
  const [cart, setCart] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');

  const createTransaction = async () => {
    const txn = await api.post('/transactions', { items: cart });
    setTransaction(txn);
  };

  const completePayment = async () => {
    const result = await api.post(`/transactions/${transaction.id}/complete`, {
      amount_paid: parseFloat(amountPaid),
    });
    setTransaction(result);
  };

  return (
    <div>
      <h2>Sales</h2>

      <button onClick={createTransaction}>Create Transaction</button>

      {transaction && (
        <>
          <input onChange={e => setAmountPaid(e.target.value)} />
          <button onClick={completePayment}>Complete</button>
        </>
      )}
    </div>
  );
}

export default Sales;
