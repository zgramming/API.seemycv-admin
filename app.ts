import Koa from "koa";
import KoaBody from "koa-body";
import Json from "koa-json";
import Logger from "koa-logger";
import passport from "koa-passport";
import session from "koa-session";
import Serve from "koa-static";

import cors from "@koa/cors";

import router from "./router";

const app = new Koa();

require("dotenv").config();
require("./utils/passport");

/// Passport initialize
app.keys = [process.env.KOA_SESSION_SECRET ?? ""];
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(KoaBody({ multipart: true, formLimit: 10000, textLimit: 10000 }));

app.use(cors());
app.use(Json());
app.use(Logger());

/// Make folder file accessible via url
app.use(Serve("./public"));

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log("Koa server is started on " + process.env.PORT);
});
