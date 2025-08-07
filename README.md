# BitpayX Backend

This backend provide endpoints for make orders and transfers of tokens ERC-20 over Sepolia.

## Running Locally

```bash
npm install
npm run dev
```

In other terminal:

```bash
npx tsx consumer.ts
```

## Endpoints

### 1. Create order

```curl
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{"amount": 123, "userId": "user123", "idempotencyKey": "abc-123"}'
```

### 2. Transfer tokens ERC-20

```curl
curl -X POST http://localhost:3000/token/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0x1782c702F06863A97b1f9B92B8B28158f39BeCC4",
    "amount": "10"
  }'
```

Response:
```
{
  "success": true,
  "txHash": "0x26a6506f31000250e214304469620583b587aff0b3a29dad3518d2640ec72efd"
}
```

You can verify the transaction in:
[Sepolia Etherscan](https://sepolia.etherscan.io/tx/0x26a6506f31000250e214304469620583b587aff0b3a29dad3518d2640ec72efd)

### 3. Check balance

```curl
curl -X GET http://localhost:3000/token/0x1782c702F06863A97b1f9B92B8B28158f39BeCC4/balance
```

Response:
```
{"address":"0x1782c702F06863A97b1f9B92B8B28158f39BeCC4","balance":"10.0"}
```