import { Request, Response } from "express";
import { AsyncHandler } from "../../../../utils/AsyncHandler";
import * as fs from "fs";
import path from "path";

type StockItem = { sku: string; stock: number };
type Transaction = { sku: string; type: string; qty: number };

const readJsonFile = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
};

const getCurrentStock = async (
  sku: string
): Promise<{ sku: string; qty: number }> => {
  const stockData: StockItem[] = readJsonFile(
    path.join(__dirname, "./stock.json")
  );

  const transactions: Transaction[] = readJsonFile(
    path.join(__dirname, "./transactions.json")
  );

  const initialStock = stockData.find((item) => item.sku === sku)?.stock ?? 0;

  const transactionsForSku = transactions.filter(
    (transaction) => transaction.sku === sku
  );

  if (transactionsForSku.length === 0 && initialStock === 0) {
    throw new Error(`SKU ${sku} not found in stock or transactions.`);
  }

  let totalQty = initialStock;

  for (const transaction of transactionsForSku) {
    if (transaction.type === "order") {
      totalQty += transaction.qty;
    } else if (transaction.type === "refund") {
      totalQty -= transaction.qty;
    }
  }

  return { sku, qty: totalQty };
};

const currentStock = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const sku: string | undefined = req.query.sku as string | undefined;

    if (!sku) {
      throw new Error("SKU parameter is missing.");
    }
    const result = await getCurrentStock(sku);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export { currentStock };
