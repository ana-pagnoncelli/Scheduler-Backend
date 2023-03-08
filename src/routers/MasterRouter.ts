import { Request, Response, NextFunction, Router } from "express";
import ThemeARouter from "./themeA/ThemeARouter";
import ThemeBRouter from "./themeB/ThemeBRouter";
import ThemeAController from "../controllers/ThemeAController";

class MasterRouter {
  private _router = Router();
  private _subrouterA = ThemeARouter;
  private _subrouterB = ThemeBRouter;
  private _controller = ThemeAController;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use("/themeA", this._subrouterA);
    this._router.use("/themeB", this._subrouterB);
    this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = this._controller.defaultMethod();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    });
  }
}

export = new MasterRouter().router;
