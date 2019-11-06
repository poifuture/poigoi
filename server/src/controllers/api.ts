import crypto from "crypto";
import request from "request";
import { Response, Request } from "express";

/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
  res.send("API works!");
};

const PoiGoiPouchDBHost =
  process.env.POIGOI_POUCHDB_HOST ||
  `http://127.0.0.1:${process.env.PORT || 3000}`;

const ServicePouchDBAuth = {
  username: "poigoi-user-registration-service",
  password:
    process.env.POIGOI_USER_REGISTRATION_SERVICE_POUCHDB_PASSWORD ||
    "UNSAFE_PASSWORD"
};

export const createUser = async (req: Request, res: Response) => {
  console.log("req", req);
  console.log("req.body", req.body);
  const PoiUserId = req.body.PoiUserId;
  console.log("PoiUserId", PoiUserId);
  if (!PoiUserId) {
    res.json({
      step: "validate-poiuserid",
      error: "Validate PoiUserId failed."
    });
    return;
  }
  const PouchDBUserName = "poiuser-" + PoiUserId;
  const PouchDBPassword = crypto
    .createHash("sha256")
    .update("Salt" + PouchDBUserName)
    .digest("base64");
  request.put(
    `${PoiGoiPouchDBHost}/_users/org.couchdb.user:${PouchDBUserName}`,
    {
      auth: ServicePouchDBAuth,
      json: {
        name: PouchDBUserName,
        password: PouchDBPassword,
        roles: [],
        type: "user"
      }
    },
    (error: any, response: any) => {
      if (!response || !response.body || !response.body.ok) {
        res.json({ step: "create-user", error, response });
        return;
      }
      request.put(
        `${PoiGoiPouchDBHost}/${PouchDBUserName}`,
        {
          auth: ServicePouchDBAuth,
          json: {} // For parsing json response
        },
        (error: any, response: any) => {
          if (!response || !response.body || !response.body.ok) {
            res.json({ step: "create-database", error, response });
            return;
          }
          request.put(
            `${PoiGoiPouchDBHost}/${PouchDBUserName}/_security`,
            {
              auth: ServicePouchDBAuth,
              json: {
                members: {
                  names: [PouchDBUserName]
                }
              }
            },
            (error: any, response: any) => {
              if (!response || !response.body || !response.body.ok) {
                res.json({ step: "create-permission", error, response });
                return;
              }
              res.json({
                PoiUserId: PoiUserId,
                PouchDBPassword: PouchDBPassword
              });
            }
          );
        }
      );
    }
  );
};
