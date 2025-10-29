# BitpayX Backend xxx

This backend provide endpoints for make orders and transfers of tokens ERC-20 over Sepolia.

## Running Locally xxx

```bash
npm install
npm run dev
```

In other terminal:

```bash
npx tsx consumer.ts
```

Sample Response with new flow with token transfer:

```
📦 Mensaje recibido: {
  key: '4',
  value: '{"id":4,"userId":"user123","amount":"123","status":"pending","createdAt":"2025-08-07T05:51:07.741Z","idempotencyKey":"abc-123"}'
}
🆕 Wallet creada para user123: 0x840C7A58deF832A98245B28bC840550E8Ee975A5
✅ Transferencia realizada. TX Hash: 0xa9dad1126a229f762fcd8219b96a1f492c753d91d1db006343fc64e66c71c328
```

## Prisma

Haces cambios en schema.prisma after execute:

```bash
npx prisma migrate dev --name add_xxx
npx prisma generate
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
***Estás enviando tokens a la dirección del contrato, ¡no a una wallet de usuario!

Por eso, aunque la transacción es válida y aparece en Etherscan, esos tokens se "quedaron" en el contrato — y no podrás gastarlos a menos que el contrato tenga una lógica para ello (el tuyo no la tiene).***

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

### 4. check wallet

```curl
curl -X GET http://localhost:3000/users/:user_id/wallet
```

## FlowChart

```
graph TD
  A[User places order] --> B[orderProducer sends message to Kafka topic 'orders']
  B --> C[orderConsumer receives message]
  C --> D{Does user have wallet?}
  D -- Yes --> E[Use existing wallet]
  D -- No --> F[Generate new wallet]
  F --> G[Save wallet to DB]
  E --> H[transferTokens via tokenService]
  G --> H
  H --> I[Wait for transaction confirmation]
  I --> J[Return txHash or log success]
```
