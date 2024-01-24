import customNode from './customNode';
import textCardNode from "./textCardNode";
import tableNode from "@/components/Flow/registerNode/TableNode";
import trendNode from "@/components/Flow/registerNode/trendNode";
import trendBarNode from "@/components/Flow/registerNode/trendBarNode";

export default function registerNode() {
    customNode();
    textCardNode();
    tableNode();
    trendNode();
    trendBarNode();
}