import io from "socket.io-client";
import { localhost } from "../keys";

const socket = io(`${localhost}/`);

export default socket;