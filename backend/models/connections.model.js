import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
  userId: {
    // kisne bheja
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    // kisko bheja
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null, // awaited,

    // AGAR ACCEPT HOGA TO MY CONNECTIONS KE ANDAR SHOW HOGA...REJCTED? TO SHOW NAHI HOGA ...AWAITED HAI TO REQUEST KE ANDAR DIKHEGA
  },
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

export default ConnectionRequest;
