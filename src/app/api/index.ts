import { Route } from "rwsdk/router";

const handler: Route = async (c) => {
  return Response.json({ message: "Hello, World!" });
};

export default handler;
