import { Request, Response } from "express";
import { currentStock } from "./../app/src/controllers/SkuAssignment";
import * as fs from "fs";

jest.mock("fs");
jest.mock("../../../../utils/AsyncHandler");

describe("currentStock controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: { sku: "LTV719449/39/39" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
  });

  it("should return current stock for a valid SKU", async () => {
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(
      JSON.stringify([{ sku: "LTV719449/39/39", stock: 8525 }])
    );
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(
      JSON.stringify([{ sku: "LTV719449/39/39", type: "order", qty: 5 }])
    );

    // Correctly handle AsyncHandler by mocking its behavior
    const asyncHandlerMock = jest.fn((fn) => fn);
    (asyncHandlerMock as any).mockImplementation((fn: any) => {
      return async (req: Request, res: Response, next: any) => {
        try {
          await fn(req, res);
        } catch (error) {
          next(error);
        }
      };
    });

    await currentStock(req as Request, res as Response, asyncHandlerMock);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sku: "LTV719449/39/39",
      qty: 8525 + 5,
    });
  });

  it("should handle missing SKU parameter", async () => {
    if (req.query) {
      req.query.sku = undefined;
    }

    // Similar mock setup as above for AsyncHandler
    const asyncHandlerMock = jest.fn((fn) => fn);
    (asyncHandlerMock as any).mockImplementation((fn: any) => {
      return async (req: Request, res: Response, next: any) => {
        try {
          await fn(req, res);
        } catch (error) {
          next(error);
        }
      };
    });

    await currentStock(req as Request, res as Response, asyncHandlerMock);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "SKU parameter is missing.",
    });
  });
});
