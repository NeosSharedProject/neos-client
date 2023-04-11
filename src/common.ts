import axios from "axios";
import { v4 } from "uuid";

export const BASE_URL = "https://cloudx.azurewebsites.net/";

export const post = axios.post;
export const get = axios.get;
export const put = axios.put;
export const patch = axios.patch;
export const httpDelete = axios.delete;

export const uuidv4 = v4;
